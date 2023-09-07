/* import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; */
import { faClock, faEye, faPenToSquare, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from "react";
import styles from "../styles/MeetingCard.module.css";
import ModalCard from "./ModalCard";

const MeetingCard = ({ datetime, currentDate, setCurrentDate, room, rooms, setMeetings, sortedMeetings, meeting, setIsMeetingUpdated, openUpdateResponseModal, closeUpdateResponseModal }) => {

  const modal = useRef(null);

  const openModal = () => {
    modal.current.showModal();
  }
  const closeModal = () => {
    modal.current.close();
  }

  return (
    <>
      <div
        className={styles.card}
        /* key={meeting._id} */
        style={{ borderLeftColor: meeting.active ? "#00743B" : "#e6e6e6" }}
        onClick={() => openModal()}
      >
        <header className={styles.header}>
          <div className={styles.toolbar}>
            <h3>{meeting.title}</h3>
            <div className={styles.actions}>
              <FontAwesomeIcon className={styles.icon} icon={faEye} />
              {/* <span className={styles.action}>View</span> */}
              &nbsp;/&nbsp;
              {/* <span className={styles.action}>Edit</span> */}
              <FontAwesomeIcon className={styles.icon} icon={faPenToSquare} />
              &nbsp;/&nbsp;
              {/* <span className={styles.action}>Delete</span> */}
              <FontAwesomeIcon className={styles.icon} icon={faTrash} />
            </div>
          </div>
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
              {/** @note anonymous function */}
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

      <dialog ref={modal}>
        <ModalCard datetime={datetime} currentDate={currentDate} setCurrentDate={setCurrentDate} room={room} rooms={rooms} setMeetings={setMeetings} sortedMeetings={sortedMeetings} meeting={meeting} setIsMeetingUpdated={setIsMeetingUpdated} openUpdateResponseModal={openUpdateResponseModal} closeUpdateResponseModal={closeUpdateResponseModal}

       /*  id={meeting._id} title={meeting.title} description={meeting.description} host={meeting.host} start={meeting.start} end={meeting.end} active={meeting.active} */ close={closeModal} />
      </dialog>
    </>
  )
}

export default MeetingCard;
