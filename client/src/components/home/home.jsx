import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
function Home({ socket }) {
  const navigate = useNavigate();
  const [user, SetUser] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", user);
    localStorage.setItem("room", "GlobalChat");
    socket.emit("joinRoom", {
      user,
      socketID: 0,
      room: "GlobalChat",
    });

    navigate("/chat");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2>Вход в чат</h2>
      <label htmlFor="user"></label>
      <input
        className={styles.userInput}
        type="text"
        id="user"
        value={user}
        onChange={(e) => SetUser(e.target.value)}
      ></input>
      <button type="submit" className={styles.homeBtn}>
        Войти
      </button>
    </form>
  );
}

export default Home;
