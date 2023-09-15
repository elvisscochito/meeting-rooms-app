
import { faCircleDot, faCircleExclamation, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import apiUrlPrefix from '../config/apiUrlPrefix.js';
import styles from '../styles/MeetingsHistory.module.css';

function MeetingsHistory() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch(`${apiUrlPrefix}/meetings`);
        const meetings = await response.json();
        setMeetings(meetings);
        console.log(meetings);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeetings();

  }, []);

  const calculateMeetingStatus = (meeting) => {
    const now = new Date();
    const meetingStart = new Date(meeting.start);
    const meetingEnd = new Date(meeting.end);

    if (now >= meetingStart && now <= meetingEnd) {
      return "ongoing";
    } else if (now > meetingEnd) {
      return "ended";
    } else {
      return "upcoming";
    }
  };

  const endedMeetings = meetings.filter(meeting => calculateMeetingStatus(meeting) === "ended");

  return (
    <div className={styles.grid}>
      <header className={styles.header}>
        <h1>Historial</h1>
      </header>

      <div className={styles.meetingsWrapper}>
        <div className={styles.meetings}>
          {endedMeetings.map(meeting => (
            <div className={styles.meeting} key={meeting._id}>
              {
                calculateMeetingStatus(meeting) === "ongoing" ? (
                  <FontAwesomeIcon icon={faCircleDot} style={{ color: "#00743B" }} />
                ) : calculateMeetingStatus(meeting) === "ended" ? (
                  <FontAwesomeIcon icon={faClockRotateLeft} style={{ color: "#c0c0c0" }} />
                ) : (
                  <FontAwesomeIcon icon={faCircleExclamation} style={{ color: "#f3ae2d" }} />
                )
              }
              <span>{meeting.title}</span>
              {
                new Date(meeting.start).toLocaleDateString('es-Es', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              }
            </div>
          ))}
        </div>
      </div>
    </div >
  )
}

export default MeetingsHistory
