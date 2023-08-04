import { useRef, useState } from "react";
import Modal from "../components/Modal";
import styles from "../styles/Meetings.module.css";

function Meetings() {
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Today's work",
      description: "Let's talk about today's work",
      date: "August 1st, 2021",
      time: "10am - 12pm (2hrs)",
      host: "Apaez",
      active: true,
    },
    {
      id: 2,
      title: "Client's needs",
      description: "What client are looking for?",
      date: "August 2nd, 2021",
      time: "1pm - 3pm (2hrs)",
      host: "Apaez",
      active: false,
    },
    {
      id: 3,
      title: "Review today's work",
      description: "Review today's work",
      date: "August 3rd, 2021",
      time: "10am - 12pm (2hrs)",
      host: "Apaez",
      active: false,
    },
  ]);
  const dialog = useRef(null);
  const openModal = () => {
    dialog.current.showModal();
  }
  const closeModal = () => {
    dialog.current.close();
  }

  return (
    <>
      <header className={styles.header}>
        <h1>&larr;Reuniones</h1>
      </header>
      <div className={styles.content}>
        <h2>August 1st, 2021</h2>
        <div className={styles.meetings}>
          {meetings.map((meeting) => (
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
