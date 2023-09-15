import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrlPrefixLocal } from '../config/apiUrlPrefix.js';
import styles from '../styles/RoomCard.module.css';

const RoomCard = ({ room, dateTime }) => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {

    const fetchMeetings = async () => {
      try {
        const response = await fetch(`${apiUrlPrefixLocal}/${room.name}/meetings?date=${dateTime.toISOString()}`);
        const meetings = await response.json();
        setMeetings(meetings);
        console.log(meetings);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeetings();

    const intervalId = setInterval(fetchMeetings, 1000);
    return () => {
      clearInterval(intervalId);
    };

  }, [room.name, dateTime]);

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

  return (
    <div className={styles.card}>

      {
        meetings.length > 0 ? (
          <>
            <header className={styles.header}>
              <h2>{room.name}</h2>
              <h3 className={styles.h3}>
                {meetings.length} reuniones programadas hoy
              </h3>
            </header>

            <div className={styles.meetingsWrapper}>
              <div className={styles.meetings}>
                {
                  meetings.map(meeting => (
                    <div className={styles.meeting} key={meeting._id}>
                      <div className={styles.info}>
                        {calculateMeetingStatus(meeting) === "ongoing" ? (
                          <span className={styles.statusDot} style={{ backgroundColor: "#00743B", color: "#ffffff" }}></span>
                        ) : calculateMeetingStatus(meeting) === "ended" ? (
                          <span className={styles.statusDot} style={{ backgroundColor: "#c0c0c0" }}></span>
                        ) : (
                          <span className={styles.statusDot} style={{ backgroundColor: "#f3ae2d", color: "#ffffff" }}></span>
                        )}
                        <span>{meeting.title}</span>
                      </div>

                      <div className={styles.time}>
                        <span>
                          {
                            new Date(meeting.start).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true
                            }).replace("00:00", "12:00").replace(/^0|:00/g, "").replace(/[\s.]+/g, "")
                          }
                        </span>
                        -
                        <span>
                          {
                            new Date(meeting.end).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true
                            }).replace("00:00", "12:00").replace(/^0|:00/g, "").replace(/[\s.]+/g, "")
                          }
                        </span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </>
        ) : (
          <>
            <header className={styles.header}>
              <h2>{room.name}</h2>
            </header>

            <div className={styles.meetings}>
              <h3 className={styles.h3NoMeetings}>
                Sin reuniones programadas para hoy
              </h3>
            </div>
          </>
        )
      }
      <footer className={styles.footer}>
        <Link to={`${room.name}/meetings`} className={styles.link}>
          Ver m&aacute;s&nbsp;<FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </footer>

    </div>
  )
}

export default RoomCard;
