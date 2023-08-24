import styles from "../styles/Meetings.module.css";

const DateSlider = ({ currentDay, setCurrentDay }) => {
  const goToPreviousDay = () => {
    const previousDay = new Date(currentDay);
    previousDay.setDate(currentDay.getDate() - 1);
    setCurrentDay(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDay);
    nextDay.setDate(currentDay.getDate() + 1);
    setCurrentDay(nextDay);
  };
  return (
    <div className={styles.container}>
      <span className={styles.arrowButton} onClick={goToPreviousDay}>
        &larr;
      </span>
      <h2 className={styles.date}>
        {/** @note convert currentDay Date object to a string to render it */}
        {currentDay.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </h2>
      <span className={styles.arrowButton} onClick={goToNextDay}>
        &rarr;
      </span>
    </div>
  )
}

export default DateSlider;
