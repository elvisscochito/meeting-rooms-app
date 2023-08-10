import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import styles from "../styles/Meetings.module.css";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dialog = useRef(null);
  const { room } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/room");
        const rooms = await response.json();
        console.log(rooms);
        setRooms(rooms);
      } catch (error) {
        console.error("fetchRooms: ", error);
        setError(error.message);
      }
    }

    const fetchMeetings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/meetings/${room}`);
        const meetings = await response.json();
        console.log(meetings);
        setMeetings(meetings);
      } catch (error) {
        console.error("fetchMeetings: ", error);
        setError(error.message);
      }
    }

    Promise.allSettled([fetchRooms(), fetchMeetings()])
      .then((results) => {
        setIsLoading(false);
        results.forEach((result) => {
          if (result.status === 'rejected') {
            console.error("allSettled", result.reason);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

  }, [room]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  const openModal = () => {
    dialog.current.showModal();
  }
  const closeModal = () => {
    dialog.current.close();
  }

  const handleRoomChange = (room) => {
    navigate(`/meetings/${room}`, { replace: true });
  }

  /** @note conditional styles (made const instead inline styles to avoid verbose code) */
  const buttonStyles = (isActive) => {
    return {
      backgroundColor: isActive ? "#D9D9D9" : "#F5F5F5",
      /* color: isActive ? "white" : "black", */
      fontWeight: isActive ? "600" : "normal"
    };
  };
  /* const addMeeting = (meeting) => {
    setMeetings([...meetings, meeting]);
  } */

  return (
    <>
      <header className={styles.header}>
        <h1>&larr;Reuniones</h1>
      </header>
      <div className={styles.content}>
        <h2>August 1st, 2021</h2>

        {
          isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
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

              <div className={styles.meetings}>
                {meetings.length === 0 && !isLoading ? (
                  <span>
                    No meetings upcoming
                    {/* Sin reuniones programadas */}
                  </span>
                ) : (
                  meetings.map((meeting) => (
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
                        <span>{meeting.time}</span>
                        <span>{meeting.host}</span>
                      </footer>
                    </div>
                  ))
                )
                }
              </div>
            </>
          )
        }

      </div>
      <footer className={styles.footer}>
        <dialog ref={dialog}>
          <Modal close={closeModal} />
        </dialog>
        <button className={styles.button} onClick={openModal}>Nueva reuni&oacute;n</button>
      </footer>
    </>
  );
}

export default Meetings;
