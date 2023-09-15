import { useEffect, useState } from 'react';
import RoomCard from '../components/RoomCard.jsx';
import apiUrlPrefix from '../config/apiUrlPrefix.js';
import styles from '../styles/Rooms.module.css';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await fetch(`${apiUrlPrefix}/datetime`);
        const isoDateString = await response.text();

        /** @note parse isoDateString to a date object */
        const parsedDate = new Date(isoDateString);

        setDateTime(parsedDate);

      } catch (error) {
        console.error(error);
      }
    };

    fetchDateTime();

  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${apiUrlPrefix}/rooms`);
        const rooms = await response.json();
        setRooms(rooms);
        console.log(rooms);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRooms();

  }, []);

  return (
    <div className={styles.grid}>
      <header className={styles.header}>
        <h1>Salas</h1>
      </header>

      <h2 className={styles.dateTime}>
        {/** @note convert dateTime Date object to a string to render it */}
        {dateTime.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </h2>

      <div className={styles.rooms}>
        {rooms.map((room) => (
          <RoomCard room={room} dateTime={dateTime} key={room._id} />
        ))}
      </div>

    </div>
  )
}

export default Rooms;
