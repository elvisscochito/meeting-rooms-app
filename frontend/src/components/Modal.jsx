import { faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/Modal.module.css';
const Modal = ({ type, title, message, variant, close }) => {
  const handleClose = () => {
    close();
  }

  return (
    <>
      <header>
        {
          type === 'message' ? (
            <h2 className={`${styles[type]}`}><FontAwesomeIcon className={styles.icon} icon={faCircleInfo} />&nbsp;{title}</h2>
          ) : type === 'error' ? (
            <h2 className={`${styles[type]}`}><FontAwesomeIcon className={styles.icon} icon={faCircleXmark} />&nbsp;{title}</h2>
          ) : null
        }
      </header>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      <footer className={styles.footer}>
        <button type='button' className={`${styles.button} ${styles[variant]}`} onClick={() => handleClose()}>Cerrar</button>
      </footer>
    </>
  )
}

export default Modal
