/* import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; */
import { faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "../styles/MeetingCard.module.css";

const MeetingCard = ({ meeting }) => {
  return (
    <div
      className={styles.card}
      /* key={meeting._id} */
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
  )
}

export default MeetingCard;
