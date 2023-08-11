import { useState } from 'react';

import styles from '../styles/Modal.module.css';
const ModalNewMeeting = ({ close }) => {
  const [title, setTitle] = useState('');
  const handleClose = () => {
    setTitle('');
    close();
  }

  const handleCreateMeeting = async () => {
    try {
      const response = await fetch('http://localhost:3000/P103/meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      })
      const data = await response.json();
      console.log(data);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <header>
        <h1>Nueva reuni&oacute;n</h1>
      </header>
      <form className={styles.form} onSubmit={handleCreateMeeting}>
        <label htmlFor="title">T&iacute;tulo</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <footer>
          <button type='button' onClick={() => handleClose()}>Cancelar</button>
          <button type='submit'>Crear</button>
        </footer>
      </form>
    </>
  )
}

export default ModalNewMeeting
