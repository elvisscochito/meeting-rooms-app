import { useRef, useState } from "react";
import Modal from "../components/Modal";
import styles from "../styles/Meetings.module.css";

function Meetings() {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "P101"
    },
    {
      id: 2,
      name: "P102"
    }
  ]);
  const [currentActiveTab, setCurrentActiveTab] = useState(rooms[0].name);
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Today's work",
      description: "Let's talk about today's work",
      date: "August 1st, 2021",
      time: "10am - 12pm (2hrs)",
      host: "Apaez",
      active: true,
      room: "P101"
    },
    {
      id: 2,
      title: "Client's needs",
      description: "What client are looking for?",
      date: "August 2nd, 2021",
      time: "1pm - 3pm (2hrs)",
      host: "Apaez",
      active: false,
      room: "P101"
    },
    {
      id: 3,
      title: "Review today's work",
      description: "Review today's work",
      date: "August 3rd, 2021",
      time: "4pm - 6pm (2hrs)",
      host: "Apaez",
      active: false,
      room: "P101"
    },
  ]);
  const dialog = useRef(null);

  const openModal = () => {
    dialog.current.showModal();
  }
  const closeModal = () => {
    dialog.current.close();
  }

  /* const handleActiveTab = (id) => {
    setCurrentActiveTab(id);
  } */

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

        <div className={styles.roomSwitcher}>
          {
            rooms.map((rooms) => (
              <button
                className={styles.room}
                key={rooms.id}
                onClick={() => setCurrentActiveTab(rooms.name)}
                style={buttonStyles(rooms.name === currentActiveTab)}
              /* disabled={rooms.id === currentActiveTab} */
              >
                {rooms.name}
              </button>
            ))
          }
        </div>

        <div className={styles.meetings}>
          {
            meetings.filter((meeting) => currentActiveTab === meeting.room).length === 0 ? (
              <span>
                No meetings upcoming
                {/*  No hay reuniones programadas para este d&iacute;a */}
              </span>
            ) : (
              meetings.map((meeting) => (
                currentActiveTab === meeting.room &&
                <div
                  className={styles.card}
                  key={meeting.id}
                  style={{ borderLeftColor: meeting.active ? "#00743B" : "e6e6e6" }}
                >
                  <header>
                    <h3>{meeting.title}</h3>
                    <h4>{meeting.description}</h4>
                  </header>
                  <footer className={styles.cardFooter}>
                    <span>
                      {meeting.time}
                      {/* 10am - 12pm (2hrs) */}
                    </span>
                    <span>{meeting.host}</span>
                  </footer>
                </div>
              )
              ))}
        </div>
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
