import { useEffect, useState } from 'react';

import styles from '../styles/Modal.module.css';
const ModalNewMeeting = ({ room, close }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  /* const [datetime, setDatetime] = useState(null); */
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  /**
   * TODO: host debe ser un usuario registrado
   */
  const [host, setHost] = useState('');
  /* const [isButtonDisabled, setIsButtonDisabled] = useState(true); */
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setHost('');
    close();
  }

  /* useEffect(() => {
    if (title && host) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, host]); */

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await fetch("http://localhost:3000/datetime");
        const date = await response.text();
        console.log("date: ", date);

        /** @note parse date to a date object */
        const parsedDate = new Date(date);
        /* const dateForStartTime = new Date(date);
        const dateForEndTime = new Date(dateForStartTime); */

        console.log("parsedDate", parsedDate)
        const localDate = parsedDate.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });

        const [day, month, year] = localDate.split("/");
        const inputDate = `${year}-${month}-${day}`;
        console.log("inputDate", inputDate);
        setDate(inputDate);

        parsedDate.setHours(parsedDate.getHours() + 1);
        console.log(parsedDate)

        const startTime = parsedDate.toLocaleTimeString("es-ES");
        console.log("start", startTime);
        setStartTime(startTime);

        parsedDate.setHours(parsedDate.getHours() + 1);
        console.log("parsedDate", parsedDate);

        const endTime = parsedDate.toLocaleTimeString("es-ES");
        console.log("endTime", endTime);
        setEndTime(endTime);

        console.log("parsedDate", parsedDate);

      } catch (error) {
        console.error(error);
      }
    };

    fetchDateTime();
  }, []);

  const handleCreateMeeting = async () => {
    try {
      const isoStartTime = new Date(`${date}T${startTime}`).toISOString();
      const isoEndTime = new Date(`${date}T${endTime}`).toISOString();
      const response = await fetch(`http://localhost:3000/${room}/meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          start: isoStartTime,
          end: isoEndTime,
          host
        })
      })
      const data = await response.json();
      console.log(data);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  }

  const calculateDuration = () => {
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const durationInMillis = end - start;
    const durationInMinutes = Math.floor(durationInMillis / (1000 * 60));

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return { hours, minutes };
  };

  const duration = calculateDuration();

  return (
    <>
      <header>
        <h1>Nueva reuni&oacute;n</h1>
      </header>
      <form className={styles.form} onSubmit={handleCreateMeeting}>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="title">T&iacute;tulo</label>
          <input type="text" className={styles.input} id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Obligatorio' required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="description">Descripcci&oacute;n</label>
          <textarea className={styles.textarea} id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Opcional' />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="host">Host</label>
          <input type="text" className={styles.input} id="host" value={host} onChange={(e) => setHost(e.target.value)} placeholder='Obligatorio' required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label htmlFor="date">Día</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label htmlFor="startTime">Start time</label>
          <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label htmlFor="endTime">End time</label>
          <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </fieldset>

        <span>
          Duration:
          {
            duration.hours === 0 ? '' : duration.hours === 1 ? `${duration.hours} hr` : `${duration.hours} hrs`
          }
          {
            duration.minutes === 0 ? '' : duration.minutes === 1 ? ` ${duration.minutes} min` : ` ${duration.minutes} mins`
          }
        </span>

        <footer className={styles.footer}>
          <button
            type='button'
            className={`${styles.button} ${styles.variant}`}
            onClick={() => handleClose()}>Cancelar</button>
          <button
            type='submit'
            className={`${styles.button} ${styles.default}`} /* disabled={isButtonDisabled} */>Crear</button>
        </footer>
      </form>
    </>
  )
}

export default ModalNewMeeting
