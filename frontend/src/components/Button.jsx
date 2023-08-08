import styles from '../styles/Button.module.css';

const Button = ({ type, text, variant, onClick }) => {
    return <button type={type} className={`${styles.button} ${styles[variant]}`} onClick={onClick}>{text}</button>;
}

export default Button;
