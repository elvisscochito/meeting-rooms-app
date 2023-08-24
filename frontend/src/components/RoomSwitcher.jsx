import styles from "../styles/RoomSwitcher.module.css";

const RoomSwitcher = ({ rooms, handleRoomChange, room }) => {

  /** @note conditional styles (made const instead inline styles to avoid verbose code) */
  const buttonStyles = (isActive) => {
    return {
      backgroundColor: isActive ? "#00743B" /* "#D9D9D9" */ : "#F5F5F5",
      color: isActive ? "white" : "black",
      fontWeight: isActive ? "600" : "normal"
    };
  };

  return (
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
  )
}

export default RoomSwitcher;
