import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DateSlider from "../components/DateSlider";
import MeetingsWrapper from '../components/MeetingsWrapper';
import ModalNewMeeting from "../components/ModalNewMeeting";
import RoomSwitcher from "../components/RoomSwitcher";
import styles from "../styles/Meetings.module.css";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorRooms, setErrorRooms] = useState(null);
  const [errorMeetings, setErrorMeetings] = useState(null);
  /* const [datetime, setDatetime] = useState(null); */
  const [currentDay, setCurrentDay] = useState(new Date());
  const dialog = useRef(null);
  const { room } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await fetch("http://localhost:3000/datetime");
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

        setCurrentDay(parsedDate);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDateTime();
  }, []);

  useLayoutEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/rooms");
        const rooms = await response.json();
        console.log(rooms);
        setRooms(rooms);
      } catch (error) {
        setErrorRooms("Error cargando salas");
        throw error;
      }
    }

    const fetchMeetings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${room}/meetings?date=${currentDay.toISOString()}`);
        const meetings = await response.json();
        console.log(meetings);
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
  }, [room, currentDay]);

  useEffect(() => {
    if (errorRooms) {
      setIsLoading(false);
    }
  }, [errorRooms]);

  const handleRoomChange = (room) => {
    navigate(`/${room}/meetings`, { replace: true });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const meetingsBorder = meetings.map((meeting) => {
        const now = new Date();
        const meetingStart = new Date(meeting.start);
        const meetingEnd = new Date(meeting.end);

        const isActiveMeeting = now >= meetingStart && now <= meetingEnd;

        /** @note push Notifications */
        /* if (isActiveMeeting && !meeting.active) { */
        // Meeting has just started, send notification
        /* new Notification("Meeting Started", {
          body: `${meeting.title} has started.`, */
        /* vibrate: true */
        /* });
      } else if (!isActiveMeeting && meeting.active) { */
        // Meeting has just ended, send notification
        /* new Notification("Meeting Ended", {
          body: `${meeting.title} has ended.`, */
        /* vibrate: true */
        /* });
      } */

        return {
          ...meeting,
          active: isActiveMeeting
        };
      });

      setMeetings(meetingsBorder);
    }, 1000)

    return () => clearInterval(interval);
  }, [meetings]);

  useEffect(() => {
    /** @note request notifications permission */
    Notification.requestPermission();
  }, []);

  const openModal = () => {
    dialog.current.showModal();
  }
  const closeModal = () => {
    dialog.current.close();
  }

  const filteredMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.start);
    return (
      meetingDate.getDate() === currentDay.getDate() &&
      meetingDate.getMonth() === currentDay.getMonth() &&
      meetingDate.getFullYear() === currentDay.getFullYear()
    );
  });

  const sortedMeetings = filteredMeetings.sort((a, b) => {
    return (
      new Date(a.start) - new Date(b.start)
    );
  });

  return (
    <div className={styles.grid}>
      <header className={styles.header}>
        <span>&larr;</span>
        <h1>Reuniones</h1>
      </header>
      <div className={styles.content}>
        <DateSlider currentDay={currentDay} setCurrentDay={setCurrentDay} />

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
                  <MeetingsWrapper sortedMeetings={sortedMeetings} isLoading={isLoading} />
                )
              }
            </>
          )
        }
      </div>
      <footer className={styles.footer}>
        <dialog ref={dialog}>
          <ModalNewMeeting room={room} setMeetings={setMeetings} meetings={meetings} close={closeModal} />
        </dialog>
        <button className={styles.button} onClick={openModal} disabled={isLoading}>Nueva reuni&oacute;n</button>
      </footer>
    </div>
  );
}

export default Meetings;
