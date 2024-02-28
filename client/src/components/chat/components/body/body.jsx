import { useEffect } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";

function Body({ messages, status, socket }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem("hasReloaded", "true");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");
    if (hasReloaded) {
      console.log("Страница перезагружена!");
      socket.emit("showUsers", "ClobalRoom");
    }
    localStorage.removeItem("hasReloaded");
  }, [navigate]);

  const handleLeavev = () => {
    socket.emit("DeletingUser", {
      user: localStorage.getItem("user"),
      room: localStorage.getItem("room"),
    });
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <>
      <header className={styles.header}>
        <button onClick={handleLeavev} className={styles.btn}>
          Покинуть чат
        </button>
      </header>

      <div className={styles.container}>
        {messages.map((element) =>
          element.name === localStorage.getItem("user") ? (
            <div className={styles.chats} key={element.id}>
              <p className={styles.senderName}>Вы</p>
              <div className={styles.messageSender}>
                <p>{element.text}</p>
              </div>
            </div>
          ) : (
            <div className={styles.chats} key={element.id}>
              <p className={styles.secondPerson}> {element.name}</p>
              <div className={styles.messageRecipient}>
                <p>{element.text}</p>
              </div>
            </div>
          )
        )}
        <div className={styles.statys}>
          {localStorage.getItem("user") != status.user ? (
            <p>{status.data}</p>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </>
  );
}

export default Body;
