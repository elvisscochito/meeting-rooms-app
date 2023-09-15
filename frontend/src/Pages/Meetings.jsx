import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DateSlider from "../components/DateSlider";
import MeetingsWrapper from '../components/MeetingsWrapper';
import Modal from "../components/Modal";
import ModalNewMeeting from "../components/ModalNewMeeting";
import RoomSwitcher from "../components/RoomSwitcher";
import apiUrlPrefix from "../config/apiUrlPrefix.js";
import styles from "../styles/Meetings.module.css";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorRooms, setErrorRooms] = useState(null);
  const [errorMeetings, setErrorMeetings] = useState(null);
  /* const [datetime, setDatetime] = useState(null); */
  const [datetime, setDatetime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMeetingCreated, setIsMeetingCreated] = useState(false);
  const [isMeetingUpdated, setIsMeetingUpdated] = useState(false);
  const [notificationsSent, setNotificationsSent] = useState([]);
  const dialog = useRef(null);
  const subModal = useRef(null);
  const updateResponseModal = useRef(null);
  const { room } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await fetch(`${apiUrlPrefix}/datetime`);
        const isoDateString = await response.text();

        /** @note parse isoDateString to a date object */
        const parsedDate = new Date(isoDateString);

        /** @note format date */
        /* const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        };
        const formattedLocalDate = parsedDate.toLocaleDateString("es-ES", options); */

        /* if (parsedDate) { */
        setDatetime(parsedDate);
        /* } else {
          setDatetime(new Date());
        } */
        setCurrentDate(parsedDate);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDateTime();
  }, []);

  useLayoutEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${apiUrlPrefix}/rooms`);
        const rooms = await response.json();
        setRooms(rooms);
      } catch (error) {
        setErrorRooms("Error cargando salas");
        throw error;
      }
    }

    const fetchMeetings = async () => {
      try {
        const response = await fetch(`${apiUrlPrefix}/${room}/meetings?date=${currentDate.toISOString()}`);
        const meetings = await response.json();
        /* console.log(meetings); */
        setMeetings(meetings);
      } catch (error) {
        setErrorMeetings("Error cargando reuniones");
        throw error;
      }
    }

    Promise.allSettled([fetchRooms(), fetchMeetings()])
      .then((results) => {
        setIsLoading(false);
        results.forEach((result) => {
          if (result.status === 'rejected') {
            console.error(result.reason);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

    /**
     * TODO: HACER FETCH POR DÍA
     */
  }, [room, currentDate]);

  useEffect(() => {
    if (errorRooms) {
      setIsLoading(false);
    }
  }, [errorRooms]);

  const handleRoomChange = (room) => {
    navigate(`/${room}/meetings`, { replace: true });
  }

  /*   useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        const meetingsUpdated = meetings.map((meeting) => {
          const meetingStart = new Date(meeting.start);
          const meetingEnd = new Date(meeting.end);
  
          const meetingIsOngoing = now >= meetingStart && now <= meetingEnd;
          const meetingHasEnded = now > meetingEnd;
          const meetingStatus = meetingIsOngoing ? "ongoing" : meetingHasEnded ? "ended" : "upcoming";
  
          // Verifica si la notificación ya se ha enviado y si la reunión es del día de hoy
          if (!notificationsSent.includes(meeting.id) && meetingStart.getDate() === now.getDate()) {
            if (meetingIsOngoing) {
              // Envía una notificación cuando comienza la reunión
              new Notification("Reunión iniciada", {
                body: `La reunión ${meeting.title} ha iniciado.`,
                vibrate: true
              });
  
              // Actualiza el estado de notificationsSent utilizando la función de actualización del estado
              setNotificationsSent((prevNotificationsSent) => [...prevNotificationsSent, meeting.id]);
            } else if (meetingHasEnded) {
              // Envía una notificación cuando termina la reunión
              new Notification("Reunión terminada", {
                body: `La reunión ${meeting.title} ha terminado.`,
                vibrate: true
              });
  
              // Actualiza el estado de notificationsSent utilizando la función de actualización del estado
              setNotificationsSent((prevNotificationsSent) => [...prevNotificationsSent, meeting.id]);
            }
          }
  
          return {
            ...meeting,
            status: meetingStatus,
          };
        });
  
        setMeetings(meetingsUpdated);
      }, 1000);
  
      return () => clearInterval(interval);
    }, [meetings, notificationsSent]); */

  /* useEffect(() => { */
  /** @note request notifications permission */
  /* Notification.requestPermission();
}, []); */

  const openModal = () => {
    dialog.current.showModal();
  }
  const closeModal = () => {
    dialog.current.close();
  }

  const filteredMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.start);
    return (
      meetingDate.getDate() === currentDate.getDate() &&
      meetingDate.getMonth() === currentDate.getMonth() &&
      meetingDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const sortedMeetings = filteredMeetings.sort((a, b) => {
    return (
      new Date(a.start) - new Date(b.start)
    );
  });

  const openSubModal = () => {
    subModal.current.showModal();
  }
  const closeSubModal = () => {
    subModal.current.close();
  }

  const openUpdateResponseModal = () => {
    updateResponseModal.current.showModal();
  }

  const closeUpdateResponseModal = () => {
    updateResponseModal.current.close();
  }

  const goToHome = () => {
    navigate('/');
  }

  return (
    <div className={styles.grid}>
      <header className={styles.header}>
        <span><FontAwesomeIcon icon={faArrowLeft} onClick={() => goToHome()} /></span>
        <h1>Reuniones</h1>
      </header>
      <div className={styles.content}>
        <DateSlider currentDate={currentDate} setCurrentDate={setCurrentDate} />

        {
          isLoading ? (
            <span>Loading...</span>
          ) : /* !error && */ (
            <>
              {
                errorRooms ? (
                  <span>{errorRooms}</span>
                ) : (
                  <RoomSwitcher rooms={rooms} handleRoomChange={handleRoomChange} room={room} />
                )
              }

              {
                errorMeetings ? (
                  <span>{errorMeetings}</span>
                ) : (
                  <MeetingsWrapper datetime={datetime} currentDate={currentDate} setCurrentDate={setCurrentDate} room={room} rooms={rooms} sortedMeetings={sortedMeetings} setMeetings={setMeetings} setIsMeetingUpdated={setIsMeetingUpdated} openUpdateResponseModal={openUpdateResponseModal} closeUpdateResponseModal={closeUpdateResponseModal} isLoading={isLoading} />
                )
              }
            </>
          )
        }
      </div>
      <footer className={styles.footer}>
        <dialog ref={dialog}>
          <ModalNewMeeting room={room} currentDate={currentDate} setCurrentDate={setCurrentDate} setMeetings={setMeetings} meetings={meetings} close={closeModal} openSubModal={openSubModal} closeSubModal={closeSubModal} setIsMeetingCreated={setIsMeetingCreated} />
        </dialog>
        {
          currentDate.getDate() >= datetime.getDate() ? (
            <button className={styles.button} onClick={openModal} disabled={isLoading}>Nueva reuni&oacute;n</button>
          ) : (
            <button className={styles.button} disabled={true}>Nueva reuni&oacute;n</button>
          )
        }
      </footer>
      <dialog ref={subModal}>
        {
          isMeetingCreated ? (
            <Modal type={"message"} title={"Aviso"} message={"Reunión creada exitosamente"} close={closeSubModal} />
          ) : (
            <Modal type={"error"} title={"Error"} message={"Error al crear la reunión"} close={closeSubModal} />
          )
        }
      </dialog>

      <dialog ref={updateResponseModal}>
        {
          isMeetingUpdated ? (
            <Modal type={"message"} title={"Aviso"} message={"Reunión actualizada exitosamente"} close={closeUpdateResponseModal} />
          ) : (
            <Modal type={"error"} title={"Error"} message={"Error al actualizar la reunión"} close={closeUpdateResponseModal} />
          )
        }
      </dialog>
    </div>
  );
}

export default Meetings;
