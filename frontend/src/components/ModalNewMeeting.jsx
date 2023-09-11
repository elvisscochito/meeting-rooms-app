/* import { faCalendarDay, faQuoteLeft, faTextHeight, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; */
import { useEffect, useState } from 'react';
import apiUrlPrefix from '../config/apiUrlPrefix.js';
import styles from '../styles/Modal.module.css';
import { dateOptions, timeOptions } from '../utils/utils.js';

const ModalNewMeeting = ({ room, currentDate, setCurrentDate, setMeetings, meetings, close, openSubModal, closeSubModal, setIsMeetingCreated }) => {
  const [inputDate, setInputDate] = useState('');
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
    host: '',
    /* put participants as array */
    participants: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (date) => {
    const localDate = date.toLocaleDateString("es-ES", dateOptions);
    const [day, month, year] = localDate.split("/");
    const formattedLocalDate = `${year}-${month}-${day}`;
    /* const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const day = inputDate.getDate().toString().padStart(2, '0'); */
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const createDates = () => {

      /** @note create a new date object (to avoid override the original one) */
      const date = new Date(currentDate);

      const inputDate = formatDate(date);

      date.setHours(date.getHours() + 1);
      const startTime = date.toLocaleTimeString("es-ES", timeOptions);

      date.setHours(date.getHours() + 1);
      const endTime = date.toLocaleTimeString("es-ES", timeOptions);

      /** @note MAX-DATE START */

      const maxDate = new Date(inputDate);
      maxDate.setDate(maxDate.getDate() + 7);

      /** @note set the whole next week until saturday */
      maxDate.setDate(maxDate.getDate() + (6 - maxDate.getDay()));

      const [maxDay, maxMonth, maxYear] = maxDate.toLocaleDateString("es-ES", dateOptions).split("/");
      const maxInputDate = `${maxYear}-${maxMonth}-${maxDay}`;

      /** @note MAX-DATE END */

      setInputDate(inputDate);
      setMinDateValue(inputDate);
      setMaxDateValue(maxInputDate);
      setStartTime(startTime);
      setEndTime(endTime);
      /* } catch (error) {
        console.error(error);
      } */
    };

    createDates();
  }, [currentDate]);

  const validateDate = (inputDate) => {
    const selectedDate = new Date(inputDate);

    const dayOfWeek = selectedDate.getDay();

    return dayOfWeek < 6;
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Establecer la hora actual a las 00:00:00.000

    const selectedDate = new Date(newDate);

    if (selectedDate >= currentDate) {
      setInputDate(newDate);
      setErrorDateMessage('');
    } else {
      setInputDate('');
      setErrorDateMessage('Selecciona una fecha actual o futura');
    }
  }


  useEffect(() => {
    const handleMeetingSchedule = async () => {
      try {
        const start = new Date(`${inputDate}T${startTime}`).toISOString();
        const end = new Date(`${inputDate}T${endTime}`).toISOString();
        const currentDateTime = new Date().toISOString();

        if (start >= currentDateTime) {
          const response = await fetch(`${apiUrlPrefix}/${room}/meeting?start=${start}&end=${end}`);
          const data = await response.json();

          if (data.overlap) {
            setErrorTimeMessage('Ya hay una reunión programada en ese horario');
          } else {
            setErrorTimeMessage('');
          }
        } else {
          setErrorTimeMessage('Selecciona una hora de inicio en el futuro');
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleMeetingSchedule();
  }, [room, inputDate, startTime, endTime]);


  const goToDate = (dateParam) => {
    const date = new Date(dateParam);
    date.setDate(new Date(inputDate).getDate() + 1);
    return date;
  }

  /* useEffect(() => {
    const startDateTime = new Date(`${inputDate}T${startTime}`);
    const endDateTime = new Date(`${inputDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      setErrorTimeMessage('La hora de finalización debe ser posterior a la hora de inicio');
      return;
    }
  }, [inputDate, startTime, endTime]); */


  const handleCreateMeeting = async (e) => {
    e.preventDefault();

    /** @note prevent click the button multiple times */
    if (isButtonDisabled) {
      return;
    }

    const startDateTime = new Date(`${inputDate}T${startTime}`);
    const endDateTime = new Date(`${inputDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      setErrorTimeMessage('La hora de finalización debe ser posterior a la hora de inicio');
      return;
    }

    /** @note set to true while process the request */
    setIsButtonDisabled(true);

    try {
      const start = new Date(`${inputDate}T${startTime}`).toISOString();
      const end = new Date(`${inputDate}T${endTime}`).toISOString();
      const response = await fetch(`${apiUrlPrefix}/${room}/meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          start,
          end,
          host: form.host,
          participants: form.participants
        })
      })
      const data = await response.json();

      if (response.status === 201) {
        setIsButtonDisabled(true);
        setIsMeetingCreated(true);
        addMeeting(data);
        if (inputDate !== formatDate(currentDate)) {
          const moveDate = goToDate(currentDate);
          setCurrentDate(moveDate);
        }

        openSubModal();

        /* throw new Error("Simulated error"); */

        setTimeout(() => {
          closeSubModal();
        }, 3000);

      } else {
        setIsMeetingCreated(false);
      }

      handleClose();
    } catch (error) {
      console.log(error);
      setIsMeetingCreated(false);
    } finally {
      /** @note reset the state after the request is complete */
      setIsButtonDisabled(false);
    }
  }

  useEffect(() => {
    const calculateDuration = () => {
      const start = new Date(`${inputDate}T${startTime}`);
      const end = new Date(`${inputDate}T${endTime}`);

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

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      host: '',
      participants: ''
    });

    setInputDate(formatDate(currentDate));

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
          <label className={styles.label} htmlFor="host">{/* <FontAwesomeIcon className={styles.icon} icon={faUser} /> */}Responsable</label>
          <input type="text" className={styles.input} id="host" name='host' value={form.host} onChange={handleChange} placeholder='Obligatorio' required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="participants">Participantes</label>
          <input type="text" className={styles.input} id="participants" name='participants' value={form.participants} onChange={handleChange} placeholder='Opcional' />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="date">{/* <FontAwesomeIcon className={styles.icon} icon={faCalendarDay} /> */}D&iacute;a</label>
          <input type="date" className={styles.date} id="date" value={inputDate} min={minDateValue} max={maxDateValue} onChange={handleDateChange} required />
          {
            errorDateMessage && (
              <span className={styles.error}>{errorDateMessage}</span>
            )
          }
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="startTime">Inicio</label>
          <input type="time" className={styles.time} id="startTime" value={startTime} min={minTimeValue} max={maxTimeValue} step="1800" onChange={(e) => setStartTime(e.target.value)} required />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor="endTime">Final</label>
          <input type="time" className={styles.time} id="endTime" value={endTime} min={minTimeValue} max={maxTimeValue} step="1800" onChange={(e) => setEndTime(e.target.value)} required />
        </fieldset>

        <span className={styles.duration}>
          Duraci&oacute;n:&nbsp;
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
    </>
  )
}

export default ModalNewMeeting
