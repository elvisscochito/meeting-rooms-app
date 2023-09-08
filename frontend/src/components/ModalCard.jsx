import { faCircleDot, faCircleExclamation, faCircleInfo, faClockRotateLeft, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiUrlPrefix, { apiUrlPrefixLocal } from '../config/apiUrlPrefix.js';
import styles from '../styles/ModalCard.module.css';
import { dateOptions, timeOptions } from '../utils/utils.js';

const ModalCard = ({ datetime, currentDate, setCurrentDate, room, rooms, setMeetings, sortedMeetings, meeting, setIsMeetingUpdated, openUpdateResponseModal, closeUpdateResponseModal, isMeetingHidden, close }) => {
  const [title, setTitle] = useState(meeting.title);
  const [description, setDescription] = useState(meeting.description);
  const [selectedRoom, setSelectedRoom] = useState(meeting.room._id);
  const [host, setHost] = useState(meeting.host);
  const [participants, setParcipants] = useState(meeting.participants);
  const [isEditing, setIsEditing] = useState(false);


  const [originalDate, setOriginalDate] = useState(datetime);
  const [inputDate, setInputDate] = useState(meeting.start.split("T")[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


  const [meetingStatus, setMeetingStatus] = useState('');
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0
  });
  const [isConfirmingHiding, setIsConfirmingHiding] = useState(false);
  const [minTimeValue, setMinTimeValue] = useState('08:00');
  const [maxTimeValue, setMaxTimeValue] = useState('20:00');
  const [minDateValue, setMinDateValue] = useState('');
  const [maxDateValue, setMaxDateValue] = useState('');
  const [errorDateMessage, setErrorDateMessage] = useState('');
  const [errorTimeMessage, setErrorTimeMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  console.log("datetime: ", datetime);
  console.log("originalDate: ", originalDate);

  const formatDate = (date) => {
    const localDate = date.toLocaleDateString("es-ES", dateOptions);
    const [day, month, year] = localDate.split("/");
    const formattedLocalDate = `${year}-${month}-${day}`;
    console.log("date formatDate", formattedLocalDate);
    /* const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const day = inputDate.getDate().toString().padStart(2, '0'); */
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const createDates = () => {

      /** @note create a new date object (to avoid override the original one) */
      const date = new Date(currentDate);
      console.log("🚀 ~ file: ModalCard.jsx:60 ~ createDates ~ date:", date)

      const inputDate = formatDate(date);
      console.log("🚀 ~ file: ModalCard.jsx:63 ~ createDates ~ inputDate:", inputDate)

      console.warn("meeting.start", meeting.start);

      const startTime = new Date(`${inputDate}T${meeting.start.split("T")[1]}`).toLocaleTimeString("es-ES", timeOptions);

      console.log("🚀 ~ file: ModalCard.jsx:67 ~ createDates ~ startTime:", startTime)

      const endTime = new Date(`${inputDate}T${meeting.end.split("T")[1]}`).toLocaleTimeString("es-ES", timeOptions);

      console.log("🚀 ~ file: ModalCard.jsx:71 ~ createDates ~ endTime:", endTime)

      const minInputDate = formatDate(datetime);

      console.log("🚀 ~ file: ModalCard.jsx:74 ~ createDates ~ minInputDate:", minInputDate)

      /** @note MAX-DATE START */

      const maxDate = new Date(inputDate);
      maxDate.setDate(maxDate.getDate() + 7);

      /** @note set the whole next week until saturday */
      maxDate.setDate(maxDate.getDate() + (6 - maxDate.getDay()));

      const [maxDay, maxMonth, maxYear] = maxDate.toLocaleDateString("es-ES", dateOptions).split("/");
      const maxInputDate = `${maxYear}-${maxMonth}-${maxDay}`;

      /** @note MAX-DATE END */

      setInputDate(inputDate);
      setMinDateValue(minInputDate);
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

    if (validateDate(newDate)) {
      setInputDate(newDate);
      setErrorDateMessage('');
    } else {
      setInputDate('');
      setErrorDateMessage('Selecciona un día de lunes a sábado');
    }
  }

  useEffect(() => {
    const handleMeetingSchedule = async () => {
      try {
        const start = new Date(`${inputDate}T${startTime}`).toISOString();
        const end = new Date(`${inputDate}T${endTime}`).toISOString();
        const response = await fetch(`${apiUrlPrefix}/${room}/meeting?start=${start}&end=${end}`);

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
  }, [room, inputDate, startTime, endTime]);

  const goToDate = (dateParam) => {
    const date = new Date(dateParam);
    date.setDate(new Date(inputDate).getDate() + 1);
    return date;
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

  const handleClose = () => {
    setIsEditing(false);
    setIsConfirmingHiding(false);

    /* setForm({
      title: '',
      description: '',
      host: ''
    });

    setInputDate(formatDate(currentDate)); */

    close();
  }

  const handleUpdateMeeting = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrlPrefix}/${room}/meeting/${meeting._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          start: `${inputDate}T${startTime}`,
          end: `${inputDate}T${endTime}`,
          host,
          room: selectedRoom
          /* room: {
            _id: selectedRoom,
            name: rooms.find((room) => room._id === selectedRoom).name
          } */
        })
      });

      const data = await response.json();
      console.log("data:", data.meeting);

      if (response.ok) {

        setIsMeetingUpdated(true);
        setIsButtonDisabled(true);

        const updatedMeeting = {
          ...meeting,
          title,
          description,
          start: `${inputDate}T${startTime}`,
          end: `${inputDate}T${endTime}`,
          host,
          room: {
            _id: selectedRoom,
            name: rooms.find((room) => room._id === selectedRoom).name
          }
        };

        if (updatedMeeting.room._id !== meeting.room._id) {
          handleRoomChange(updatedMeeting.room.name);

          /** @note remove the meeting  */
          const updatedMeetings = sortedMeetings.filter((m) => m._id !== updatedMeeting._id);

          setMeetings(updatedMeetings);
        } else {

          /** @note replace original meeting with the updated one */
          const updatedMeetings = sortedMeetings.map((meeting) => {
            if (meeting._id === updatedMeeting._id) {
              return updatedMeeting;
            } else {
              return meeting;
            }
          });

          setMeetings(updatedMeetings);
        }

        if (inputDate !== formatDate(currentDate)) {
          const moveDate = goToDate(currentDate);
          console.log("moveDate", moveDate);
          setCurrentDate(moveDate);
        }

        openUpdateResponseModal();

        /* throw new Error("Simulated error"); */

        setTimeout(() => {
          closeUpdateResponseModal();
        }, 3000);

      } else {
        setIsMeetingUpdated(false);
      }

      handleClose();
    } catch (error) {
      console.error(error);
      setIsMeetingUpdated(false);
    } finally {
      setIsButtonDisabled(true);
    }
  }

  const handleHideMeeting = async () => {
    try {
      const response = await fetch(`${apiUrlPrefixLocal}/${room}/meeting/${meeting._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visible: false
        })
      });

      const data = await response.json();
      console.log("data:", data.meeting);

      if (response.ok) {
        /* setIsMeetingHidden(true); */
        setIsButtonDisabled(true);

        /* setMeetings with previous meetings and updated the new one */
        const updatedMeetings = sortedMeetings.map((meeting) => {
          if (meeting._id === data.meeting._id) {
            return data.meeting;
          } else {
            return meeting;
          }
        });

        setMeetings(updatedMeetings);

        /* const updatedMeetings = sortedMeetings.filter((m) => m._id !== meeting._id);

        setMeetings(updatedMeetings); */

        handleClose();

        /* openUpdateResponseModal();

        setTimeout(() => {
          closeUpdateResponseModal();
        }, 3000); */

      } /* else {
        setIsMeetingHidden(false);
      } */
    } catch (error) {
      console.error(error);
      /* setIsMeetingHidden(false); */
    } finally {
      setIsButtonDisabled(true);
    }
  }

  const handleRoomChange = (newRoom) => {
    navigate(`/${newRoom}/meetings`, { replace: true });
  }

  useEffect(() => {
    const calculateMeetingStatus = () => {
      const meetingStart = new Date(meeting.start);
      const meetingEnd = new Date(meeting.end);
      const now = new Date();

      if (now >= meetingStart && now <= meetingEnd) {
        return "Ongoing meeting";
      } else if (now > meetingEnd) {
        return "This meeting has been ended";
      } else {
        return "Upcoming meeting";
      }
    };

    const status = calculateMeetingStatus();
    setMeetingStatus(status);
  }, [meeting, meeting.start, meeting.end]);

  /** @note if meetings attributes don't change set button to disable */
  useEffect(() => {
    if (meeting.title === title /* && (title === '' || title === undefined) */ && meeting.description === description /* || description === '' */ && meeting.host === host /* || host === '' */ && meeting.room._id === selectedRoom /* && `${inputDate}T${startTime}` === meeting.start && meeting.end === `${inputDate}T${endTime}` && datetime === originalDate */

      /* && new Date(meeting.start).toLocaleTimeString("es-ES", timeOptions) === startTime */

      && (new Date(meeting.end).toLocaleDateString("es-ES", timeOptions)).toString() === (endTime).toString()
    ) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [meeting.title, meeting.description, meeting.host, meeting.room._id, meeting.start, meeting.end, title, description, host, selectedRoom, startTime, endTime]);

  /* console.warn("meeting.start, startTime", new Date(meeting.start).toLocaleTimeString("es-ES", timeOptions), `${startTime}`); */

  console.warn("meeting.end, endTime", new Date(meeting.end).toLocaleTimeString("es-ES", timeOptions), `${endTime}`);

  /* console.warn("meeting.start, inputDate", formatDate(meeting.start), `${inputDate}`); */

  return (
    <>
      {
        !isEditing && !isConfirmingHiding ? (
          <>
            <header>
              <h4 className={styles.h4}>
                <FontAwesomeIcon className={styles.icon} icon={faCircleInfo} />
                &nbsp;
                Detalles
                {
                  (meetingStatus === "Ongoing meeting" || meetingStatus === "Upcoming meeting") && (
                    <button className={styles.close} onClick={handleClose}>
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )
                }
              </h4>
              <h1>{title}</h1>
              <h3>{description}</h3>
            </header>
            <div className={styles.content}>
              {
                /* meetingStatus */
                meetingStatus === "Ongoing meeting" ? (
                  <span className={styles.ongoing}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    &nbsp;Reunión en curso
                  </span>
                ) : meetingStatus === "This meeting has been ended" ? (
                  <span className={styles.ended}>
                    <FontAwesomeIcon icon={faClockRotateLeft} />
                    &nbsp;Reunión finalizada
                  </span>
                ) : (
                  <span className={styles.upcoming}>
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    &nbsp;Reunión próxima
                  </span>
                )
              }
              <div className={styles.cardContentGroup}>
                <span className={styles.boldSpan}>Responsable:&nbsp;</span>
                <span>{host}</span>
              </div>
              <div className={styles.cardContentGroup}>
                <span className={styles.boldSpan}>Participantes:&nbsp;</span>
                <span>{participants}</span>
              </div>

              <div className={styles.cardContentGroup}>
                <span className={styles.boldSpan}>Horario:&nbsp;</span>
                <span>
                  {
                    new Date(meeting.start).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    }).replace("00:00", "12:00").replace(/^0|:00/g, "").replace(/[\s.]+/g, "")
                  }
                </span>
                &nbsp;
                -
                &nbsp;
                <span>
                  {
                    new Date(meeting.end).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    }).replace("00:00", "12:00").replace(/^0|:00/g, "").replace(/[\s.]+/g, "")
                  }
                </span>
                &nbsp;
                <span>
                  (
                  {/** @note anonymous function */}
                  {(() => {
                    const durationInMillis = new Date(meeting.end) - new Date(meeting.start);
                    const durationInMinutes = Math.floor(durationInMillis / 60000);

                    const hours = Math.floor(durationInMinutes / 60);
                    const minutes = durationInMinutes % 60;

                    return (
                      <>
                        {hours === 0 ? '' : hours === 1 ? `${hours} hr` : `${hours} hrs`}
                        {hours > 0 && minutes > 0 ? " " : ""}
                        {minutes === 0 ? '' : minutes === 1 ? `${minutes} min` : `${minutes} mins`}
                      </>
                    );
                  })()}
                  )
                </span>
              </div>
            </div>
            <footer className={styles.footer}>

              {/* {
                isMeetingHidden && (
                  <button
                    type='button'
                    className={`${styles.button} ${styles.default}`}
                    onClick={() => handleHideMeeting()}>
                    Mostrar
                  </button>
                )
              } */}

              {
                isMeetingHidden && (
                  <button
                    type='button'
                    className={`${styles.button} ${styles.danger}`}
                    onClick={() => setIsConfirmingHiding(true)}>
                    {/* <FontAwesomeIcon icon={faTrash} />
                &nbsp; */}
                    Eliminar
                  </button>
                )
              }

              {
                meetingStatus === "This meeting has been ended" && (
                  <button
                    type='button'
                    className={`${styles.button} ${styles.variant}`}
                    onClick={() => handleClose()}>
                    Cerrar
                  </button>
                )
              }

              {
                (meetingStatus === "Ongoing meeting" || meetingStatus === "Upcoming meeting") && isMeetingHidden && (
                  <button
                    type='button'
                    className={`${styles.button} ${styles.default}`}
                    onClick={() => setIsEditing(true)}>
                    Editar
                  </button>
                )
              }

            </footer>
          </>
        ) : isConfirmingHiding ? (
          <>
            <header>
              <h4 className={styles.h4Warning}>
                <FontAwesomeIcon className={styles.iconWarning} icon={faTrash} />
                &nbsp;
                Eliminar reuni&oacute;n
                <button className={styles.closeWarning} onClick={handleClose}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </h4>
            </header>
            <span className={styles.warningMessage}>
              ¿Estás seguro que deseas eliminar esta reunión?
            </span>
            <footer className={styles.footerDanger}>
              <button
                type='button'
                className={`${styles.button} ${styles.variant}`}
                onClick={() => setIsConfirmingHiding(false)}>Cancelar</button>
              <button
                type='button'
                className={`${styles.button} ${styles.dangerConfirm}`}

                /* disabled={isButtonDisabled} */

                onClick={() => {
                  setIsConfirmingHiding(false)
                  handleHideMeeting()
                  handleClose()
                }

                }>Eliminar</button>
            </footer>
          </>
        ) : (
          <>
            <button className={styles.close} onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <header className={styles.header}>
              <h1> {/* <FontAwesomeIcon className={styles.icon} icon={faCircleInfo} /> */}Editar reuni&oacute;n</h1>
            </header>
            <form className={styles.form} onSubmit={handleUpdateMeeting}>
              <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor="title">{/* <FontAwesomeIcon className={styles.icon} icon={faTextHeight} /> */}T&iacute;tulo</label>
                <input type="text" className={styles.input} id="title" name='title' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Obligatorio' required />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor="description">{/* <FontAwesomeIcon className={styles.icon} icon={faQuoteLeft} /> */}Descripcci&oacute;n</label>
                <textarea className={styles.textarea} id="description" name='description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Opcional' />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor="host">{/* <FontAwesomeIcon className={styles.icon} icon={faUser} /> */}Responsable</label>
                <input type="text" className={styles.input} id="host" name='host' value={host} onChange={(e) => setHost(e.target.value)} placeholder='Obligatorio' required />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Sala</legend>

                <div className={styles.roomsContainer}>
                  {
                    rooms.map((room) => (
                      <label key={room._id} className={styles.roomLabel} htmlFor={room.name}>
                        <input type="radio" className={styles.radio} id={room.name} name='room' value={room._id} onChange={(e) => setSelectedRoom(e.target.value)} checked={room._id === selectedRoom} />
                        &nbsp;
                        {room.name}
                      </label>
                    ))
                  }
                </div>
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
                  onClick={() => setIsEditing(false)}>Cancelar</button>
                <button
                  type='submit'
                  className={`${styles.button} ${styles.default}`}
                  /* disabled={isButtonDisabled} */>Actualizar</button>
              </footer>
            </form>
          </>

        )
      }
    </>
  )
}

export default ModalCard;
