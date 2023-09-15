import { faCalendar, faClockRotateLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import apiUrlPrefix from '../config/apiUrlPrefix.js';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const { room } = useParams();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [activeLink, setActiveLink] = useState('Rooms');

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

  const roomPath = room ? `/${room}` : (rooms.length > 0 ? `/${rooms[0].name}` : '/');


  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link} onClick={() => setActiveLink('Rooms')}>
        {/* <NavLink
        to="/"
        className={activeLink === 'Rooms' ? styles.activeLink : styles.link}
        onClick={() => setActiveLink('Rooms')}
      > */}
        <FontAwesomeIcon className={styles.icon} icon={faHouse} />
      </NavLink>

      {/* <button className={styles.button}>
        <FontAwesomeIcon className={styles.icon} icon={faPlus} />
      </button> */}

      <NavLink
        to={`${roomPath}/meetings`}
        className={location.pathname.startsWith(`${roomPath}/meetings`) ? styles.activeLink : styles.link}
        onClick={() => setActiveLink('Meetings')}
      >
        <FontAwesomeIcon className={styles.icon} icon={faCalendar} />
      </NavLink>

      <NavLink
        to={`/history`}
        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
        onClick={() => setActiveLink('History')}
      >
        <FontAwesomeIcon className={styles.icon} icon={faClockRotateLeft} />
      </NavLink>
    </nav>
  );
};

export default Navbar;
