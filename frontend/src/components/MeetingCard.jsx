/* import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; */
import { faClock, faEye, faPenToSquare, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLayoutEffect, useRef, useState } from "react";
import styles from "../styles/MeetingCard.module.css";
import ModalCard from "./ModalCard";

const MeetingCard = ({ datetime, currentDate, setCurrentDate, room, rooms, setMeetings, sortedMeetings, meeting, setIsMeetingUpdated, openUpdateResponseModal, closeUpdateResponseModal }) => {

  const [meetingStatus, setMeetingStatus] = useState('');
  const [isMeetingHidden, setIsMeetingHidden] = useState(false);

  const modal = useRef(null);

  const openModal = () => {
    modal.current.showModal();
  }
  const closeModal = () => {
    modal.current.close();
  }

  useLayoutEffect(() => {
    setIsMeetingHidden(meeting.visible);
  }, [meeting.visible]);

  /* useLayoutEffect(() => {

    const meetingStart = new Date(meeting.start).toDateString();
    const dateTime = new Date(datetime).toDateString();
    const nowDate = new Date();
    const meetingEnd = new Date(meeting.end);

    if (meetingStart === dateTime) {
      const calculateMeetingStatus = () => {

        if (nowDate === dateTime && now >= meetingStart && now <= meetingEnd) {
          return "ongoing";
        } else if (now > meetingEnd) {
          return "ended";
        } else {
          return "upcoming";
        }
      };

      const now = new Date()
      const status = calculateMeetingStatus();
      setMeetingStatus(status);
    } else {
      setMeetingStatus("ended");
    }
  }, [meeting, meeting.start, meeting.end, datetime]); */

  useLayoutEffect(() => {
    const meetingStart = new Date(meeting.start).toDateString();
    const dateTimeDate = new Date(datetime).toDateString();

    // Obtén la fecha actual en formato toDateString()
    const nowDate = new Date().toDateString();

    console.warn(meetingStart, dateTimeDate);

    // Comprueba si el día de la reunión es igual al día de dateTimeDate
    if (meetingStart === dateTimeDate) {
      const calculateMeetingStatus = () => {
        const meetingEnd = new Date(meeting.end);

        // Comprueba si la reunión ya ha comenzado y aún no ha terminado
        if (nowDate === dateTimeDate && now >= new Date(meeting.start) && now <= meetingEnd) {
          return "ongoing";
        } else if (nowDate === dateTimeDate && now > meetingEnd) {
          return "ended";
        } else {
          return "upcoming";
        }
      };

      const now = new Date();
      const status = calculateMeetingStatus();
      setMeetingStatus(status);
    } else {
      // Si no es el mismo día, establece el estado como "upcoming"
      setMeetingStatus("ended");
    }
  }, [meeting, meeting.start, meeting.end, datetime]);

  return (
    <>
      <div
        className={
          isMeetingHidden === false ? styles.cardHidden : styles.card
        }
        /* key={meeting._id} */
        style={{
          borderLeftColor:
            meetingStatus === "ongoing"
              ? "#00743B"
              : meetingStatus === "ended"
                ? "#e6e6e6"
                : "#f3ae2d",
          /* opacity: isMeetingHidden === false && 0.3 */
        }}
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
          {/* <div className={styles.cardFooterInfo}>
            <FontAwesomeIcon className={styles.icon} icon={faUser} />
            &nbsp;
            <span>{meeting.participants}</span>
          </div> */}
        </footer>
      </div>

      <dialog ref={modal}>
        <ModalCard datetime={datetime} currentDate={currentDate} setCurrentDate={setCurrentDate} room={room} rooms={rooms} setMeetings={setMeetings} sortedMeetings={sortedMeetings} meeting={meeting} setIsMeetingUpdated={setIsMeetingUpdated} openUpdateResponseModal={openUpdateResponseModal} closeUpdateResponseModal={closeUpdateResponseModal} isMeetingHidden={isMeetingHidden} setIsMeetingHidden={setIsMeetingHidden}

       /*  id={meeting._id} title={meeting.title} description={meeting.description} host={meeting.host} start={meeting.start} end={meeting.end} active={meeting.active} */ close={closeModal} />
      </dialog>
    </>
  )
}

export default MeetingCard;
