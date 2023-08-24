/* import { faCalendarDay, faQuoteLeft, faTextHeight, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; */
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Modal.module.css';
const ModalNewMeeting = ({ room, setMeetings, meetings, close }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0
  });
  const [minTimeValue, setMinTimeValue] = useState('08:00');
  const [maxTimeValue, setMaxTimeValue] = useState('20:00');
  const [minDateValue, setMinDateValue] = useState('');
  const [maxDateValue, setMaxDateValue] = useState('');
  const [errorDateMessage, setErrorDateMessage] = useState('');
  const [errorTimeMessage, setErrorTimeMessage] = useState('');
  const [isMeetingCreated, setIsMeetingCreated] = useState(false);
  const dialog = useRef(null);

  /**
   * TODO: refactor useState
   */
  const [form, setForm] = useState({
    title: '',
    description: '',
    /* date: '',
    startTime: '',
    endTime: '',
    duration: {
      hours: 0,
      minutes: 0
    }, */
    /**
     *  TODO: host debe ser un usuario registrado
     */
    host: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await fetch("http://localhost:3000/datetime");
        const date = await response.text();

        /** @note parse date to a date object */
        const parsedDate = new Date(date);

        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        };

        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit"
        };

        const localDate = parsedDate.toLocaleDateString("es-ES", dateOptions);

        const [day, month, year] = localDate.split("/");
        const inputDate = `${year}-${month}-${day}`;

        parsedDate.setHours(parsedDate.getHours() + 1);
        const startTime = parsedDate.toLocaleTimeString("es-ES", timeOptions);

        parsedDate.setHours(parsedDate.getHours() + 1);
        const endTime = parsedDate.toLocaleTimeString("es-ES", timeOptions);

        /** @note MAX-DATE START */

        const maxDate = new Date(inputDate);
        maxDate.setDate(maxDate.getDate() + 7);

        /** @note set the whole next week until saturday */
        maxDate.setDate(maxDate.getDate() + (6 - maxDate.getDay()));

        const [maxDay, maxMonth, maxYear] = maxDate.toLocaleDateString("es-ES", dateOptions).split("/");
        const maxInputDate = `${maxYear}-${maxMonth}-${maxDay}`;

        /** @note MAX-DATE END */

        setDate(inputDate);
        setMinDateValue(inputDate);
        setMaxDateValue(maxInputDate);
        setStartTime(startTime);
        setEndTime(endTime);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDateTime();
  }, []);

  const validateDate = (inputDate) => {
    const selectedDate = new Date(inputDate);

    const dayOfWeek = selectedDate.getDay();

    return dayOfWeek < 6;
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value;

    if (validateDate(newDate)) {
      setDate(newDate);
      setErrorDateMessage('');
    } else {
      setDate('');
      setErrorDateMessage('Selecciona un día de lunes a sábado');
    }
  }

  useEffect(() => {
    const handleMeetingSchedule = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${room}/meeting?start=${date}T${startTime}&end=${date}T${endTime}`);

        /* const start = new Date(`${date}T${startTime}`).toISOString();
        const end = new Date(`${date}T${endTime}`).toISOString();

        const response = await fetch(`http://localhost:3000/${room}/meeting/overlap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            start,
            end
          })
        }); */

        const data = await response.json();

        if (data.overlap) {
          setErrorTimeMessage('Ya hay una reunión programada en ese horario');
        } else {
          setErrorTimeMessage('');
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleMeetingSchedule();
  }, [room, date, startTime, endTime]);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const start = new Date(`${date}T${startTime}`).toISOString();
      const end = new Date(`${date}T${endTime}`).toISOString();
      const response = await fetch(`http://localhost:3000/${room}/meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          start,
          end,
          host: form.host
        })
      })
      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        setIsMeetingCreated(true);
        addMeeting(data);
      }

      handleClose();
    } catch (error) {
      console.log(error);
      setIsMeetingCreated(false);
    }
  }

  useEffect(() => {
    const calculateDuration = () => {
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      const durationInMillis = end - start;
      const durationInMinutes = Math.floor(durationInMillis / (1000 * 60));

      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;

      setDuration({
        hours,
        minutes
      });
    };
    calculateDuration();
  }, [startTime, endTime]);

  useEffect(() => {
    if (form.title && form.host && !errorDateMessage && !errorTimeMessage) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [form.title, form.host, errorDateMessage, errorTimeMessage]);

  /* useEffect(() => {
    if (title && host) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, host]); */

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      host: ''
    });
    close();
  }

  const addMeeting = (meeting) => {
    setMeetings([...meetings, meeting]);
  }

  return (
    <>
      <header>
        <h1>Nueva reuni&oacute;n</h1>
      </header>
      <form className={styles.form} onSubmit={handleCreateMeeting}>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="title">{/* <FontAwesomeIcon className={styles.icon} icon={faTextHeight} /> */}T&iacute;tulo</label>
          <input type="text" className={styles.input} id="title" name='title' value={form.title} onChange={handleChange} placeholder='Obligatorio' required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="description">{/* <FontAwesomeIcon className={styles.icon} icon={faQuoteLeft} /> */}Descripcci&oacute;n</label>
          <textarea className={styles.textarea} id="description" name='description' value={form.description} onChange={handleChange} placeholder='Opcional' />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="host">{/* <FontAwesomeIcon className={styles.icon} icon={faUser} /> */}Host</label>
          <input type="text" className={styles.input} id="host" name='host' value={form.host} onChange={handleChange} placeholder='Obligatorio' required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="date">{/* <FontAwesomeIcon className={styles.icon} icon={faCalendarDay} /> */}Day</label>
          <input type="date" className={styles.date} id="date" value={date} min={minDateValue} max={maxDateValue} onChange={handleDateChange} required />
          {
            errorDateMessage && (
              <span className={styles.error}>{errorDateMessage}</span>
            )
          }
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="startTime">Start time</label>
          <input type="time" className={styles.time} id="startTime" value={startTime} min={minTimeValue} max={maxTimeValue} step="1800" onChange={(e) => setStartTime(e.target.value)} required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="endTime">End time</label>
          <input type="time" className={styles.time} id="endTime" value={endTime} min={minTimeValue} max={maxTimeValue} step="1800" onChange={(e) => setEndTime(e.target.value)} required />
        </fieldset>

        <span className={styles.duration}>
          Duration:&nbsp;
          {
            duration.hours === 0 ? '' : duration.hours === 1 ? `${duration.hours} hr` : `${duration.hours} hrs`
          }
          {
            duration.minutes === 0 ? '' : duration.minutes === 1 ? ` ${duration.minutes} min` : ` ${duration.minutes} mins`
          }
        </span>
        <span className={styles.error}>{errorTimeMessage}</span>

        <footer className={styles.footer}>
          <button
            type='button'
            className={`${styles.button} ${styles.variant}`}
            onClick={() => handleClose()}>Cancelar</button>
          <button
            type='submit'
            className={`${styles.button} ${styles.default}`} disabled={isButtonDisabled}>Crear</button>
        </footer>
      </form>
      <dialog ref={dialog}></dialog>
    </>
  )
}

export default ModalNewMeeting
