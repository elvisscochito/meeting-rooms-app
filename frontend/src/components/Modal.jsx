import styles from '../styles/Modal.module.css';
const Modal = ({close}) => {
  const handleClose = () => {
    close();
  }

  return(
    <>
    <header>
      <h1>Nueva reuni&oacute;n</h1>
    </header>
    <div className={styles.content}>
      <label htmlFor="title">T&iacute;tulo</label>
      <input type="text" id="title" />
    </div>
    <footer>
      <button onClick={() => handleClose()}>Cancelar</button>
      <button>Crear</button>
    </footer>
    </>
  )
}

export default Modal
