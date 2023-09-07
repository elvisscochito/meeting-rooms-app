import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLayoutEffect } from "react";
import styles from "../styles/DateSlider.module.css";

const DateSlider = ({ currentDate, setCurrentDate }) => {
  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    do {
      previousDay.setDate(previousDay.getDate() - 1);
    } while (previousDay.getDay() === 0); // Salta los domingos
    setCurrentDate(previousDay);
  };

  const goToNextDay = () => {
    let nextDay = new Date(currentDate);
    do {
      nextDay.setDate(nextDay.getDate() + 1);
    } while (nextDay.getDay() === 0); // Salta los domingos
    setCurrentDate(nextDay);
  };

  useLayoutEffect(() => {
    if (currentDate.getDay() === 0) {
      goToNextDay();
    }
  }, [currentDate]);

  return (
    <div className={styles.container}>
      <span className={styles.arrowButton} onClick={goToPreviousDay}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </span>
      <h2 className={styles.date}>
        {/** @note convert currentDate Date object to a string to render it */}
        {currentDate.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </h2>
      <span className={styles.arrowButton} onClick={goToNextDay}>
        <FontAwesomeIcon icon={faArrowRight} />
      </span>
    </div>
  )
}

export default DateSlider;
