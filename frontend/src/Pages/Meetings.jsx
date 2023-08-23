import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalNewMeeting from "../components/ModalNewMeeting";
import styles from "../styles/Meetings.module.css";
/* import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; */
import { faUser } from '@fortawesome/free-solid-svg-icons';
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

  /**
   * TODO DEJAR LAS SALAS y no cargar reuniones  */

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
        const response = await fetch(`http://localhost:3000/${room}/meetings`);
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
        console.warn(parsedDate);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDateTime();
  }, []);

  const openModal = () => {
    dialog.current.showModal();
  }
  const closeModal = () => {
    dialog.current.close();
  }

  const handleRoomChange = (room) => {
    navigate(`/${room}/meetings`, { replace: true });
  }

  /** @note conditional styles (made const instead inline styles to avoid verbose code) */
  const buttonStyles = (isActive) => {
    return {
      backgroundColor: isActive ? "#00743B" /* "#D9D9D9" */ : "#F5F5F5",
      color: isActive ? "white" : "black",
      fontWeight: isActive ? "600" : "normal"
    };
  };

  const addMeeting = (meeting) => {
    setMeetings([...meetings, meeting]);
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

  const goToPreviousDay = () => {
    const previousDay = new Date(currentDay);
    previousDay.setDate(currentDay.getDate() - 1);
    setCurrentDay(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDay);
    nextDay.setDate(currentDay.getDate() + 1);
    setCurrentDay(nextDay);
  };

  return (
    <div className={styles.grid}>
      <header className={styles.header}>
        <span>&larr;</span>
        <h1>Reuniones</h1>
      </header>
      <div className={styles.content}>
        <div className={styles.container}>
          <span className={styles.arrowButton} onClick={goToPreviousDay}>
            &larr;
          </span>
          <h2 className={styles.date}>
            {/** @note convert currentDay Date object to a string to render it */}
            {currentDay.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </h2>
          <span className={styles.arrowButton} onClick={goToNextDay}>
            &rarr;
          </span>
        </div>

        {
          isLoading ? (
            <span>Loading...</span>
          ) : /* !error && */ (
            <>
              {
                errorRooms ? (
                  <span>{errorRooms}</span>
                ) : (
                  <div className={styles.roomSwitcher}>
                    {
                      rooms.map((rooms) => (
                        <button
                          className={styles.room}
                          key={rooms._id}
                          onClick={() => handleRoomChange(rooms.name)}
                          style={buttonStyles(rooms.name === room)}
                        /* disabled={rooms.id === currentActiveTab} */
                        >
                          {rooms.name}
                        </button>
                      ))
                    }
                  </div>
                )
              }

              {
                errorMeetings ? (
                  <span>{errorMeetings}</span>
                ) : (
                  <div className={styles.meetingsWrapper}>
                    <div className={styles.meetings}>
                      {sortedMeetings.length === 0 && !isLoading ? (
                        <span className={styles.noMeetingsMessage}>
                          No meetings upcoming
                          {/* Sin reuniones programadas */}
                        </span>
                      ) : (
                        sortedMeetings.map((meeting) => (
                          <div
                            className={styles.card}
                            key={meeting._id}
                            style={{ borderLeftColor: meeting.active ? "#00743B" : "#e6e6e6" }}
                          >
                            <header>
                              <h3>{meeting.title}</h3>
                              <h4>{meeting.description}</h4>
                            </header>
                            <footer className={styles.cardFooter}>
                              <div className={styles.cardFooterInfo}>
                                <FontAwesomeIcon className={styles.icon} icon={faClock} />
                                &nbsp;
                                <span>
                                  {
                                    new Date(meeting.start).toLocaleTimeString("es-ES", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true
                                    }).replace("00:00", "12:00").replace(/^0|:00/g, "").replace(/[\s.]+/g, "")
                                  }
                                </span>
                                &nbsp;
                                -
                                &nbsp;
                                <span>
                                  {
                                    new Date(meeting.end).toLocaleTimeString("es-ES", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true
                                    }).replace("00:00", "12:00").replace(/^0|:00/g, "").replace(/[\s.]+/g, "")
                                  }
                                </span>
                                &nbsp;
                                <span>
                                  (
                                  {(() => {
                                    const durationInMillis = new Date(meeting.end) - new Date(meeting.start);
                                    const durationInMinutes = Math.floor(durationInMillis / 60000);

                                    const hours = Math.floor(durationInMinutes / 60);
                                    const minutes = durationInMinutes % 60;

                                    return (
                                      <>
                                        {hours === 0 ? '' : hours === 1 ? `${hours} hr` : `${hours} hrs`}
                                        {hours > 0 && minutes > 0 ? " " : ""}
                                        {minutes === 0 ? '' : minutes === 1 ? `${minutes} min` : `${minutes} mins`}
                                      </>
                                    );
                                  })()}
                                  )
                                </span>
                              </div>
                              <div className={styles.cardFooterInfo}>
                                <FontAwesomeIcon className={styles.icon} icon={faUser} />
                                &nbsp;
                                <span>{meeting.host}</span>
                              </div>
                            </footer>
                          </div>
                        ))
                      )
                      }
                    </div>
                  </div>
                )
              }
            </>
          )
        }
      </div>
      <footer className={styles.footer}>
        <dialog ref={dialog}>
          <ModalNewMeeting room={room} addMeeting={addMeeting} close={closeModal} />
        </dialog>
        <button className={styles.button} onClick={openModal} disabled={isLoading}>Nueva reuni&oacute;n</button>
      </footer>
    </div>
  );
}

export default Meetings;
