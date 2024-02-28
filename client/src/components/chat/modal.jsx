import styles from "./styles.module.css";
function Modal({ socket }) {
  return (
    <div id="myModal" className={styles.modal}>
      <div className={styles.modalContent}>
        <span id="close" className={styles.close}>
          &times;
        </span>
        <p>Некоторый текст в модальном..</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            console.log(e.target.input.value);
            socket.emit("createRoom", e.target.input.value);
          }}
        >
          <input
            name="input"
            id="Inp"
            onInput={(e) => {
              console.log(e.target.value);
            }}
            type="text"
          />
          <button type="submit"></button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
