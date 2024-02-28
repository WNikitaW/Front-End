import { useState } from "react";
import styles from "./styles.module.css";

function MassageBlock({ socket }) {
  const [message, SetMessage] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("user")) {
      socket.emit("message", {
        text: message,
        name: localStorage.getItem("user"),
        id: `${socket.id} - ${Math.random()}`,
        socketID: socket.id,
        room: localStorage.getItem("room"),
      });
    }
    SetMessage("");
  };

  const isTyping = () =>
    socket.emit("typing", {
      data: `${localStorage.getItem("user")} is typing`,
      room: localStorage.getItem("room"),
      user: localStorage.getItem("user"),
    });

  return (
    <div className={styles.massageBlock}>
      <form className={styles.form} onSubmit={handleSend}>
        <input
          type="text"
          className={styles.userMessage}
          value={message}
          onChange={(e) => SetMessage(e.target.value)}
          onKeyDown={isTyping}
        ></input>
        <button type="submit" className={styles.btn}>
          Отправить
        </button>
      </form>
    </div>
  );
}

export default MassageBlock;
