import { useState } from "react";
import styles from "./styles.module.css";
import { useEffect } from "react";
import { myEmitter } from "./eventEmitter";
function SideBar({ socket }) {
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.emit("createRoom");
    const users = document.getElementById("user");
    users.style.display = "none";
  }, []);

  useEffect(() => {
    socket.on("Rooms", handlesetRooms);
    return () => {
      socket.off("Rooms", handlesetRooms);
    };
  }, [socket]);
  useEffect(() => {
    socket.on("responseNewUser", handleNewUsers);
    return () => {
      socket.off("responseNewUser", handleNewUsers);
    };
  }, [socket]);
  const handlesetRooms = (data) => {
    setRooms(data);
  };

  const handleNewUsers = (data) => {
    console.log("Received new users:", data);
    setUsers(data.users);
    setRoom(data.room);
  };

  function showChats() {
    const users = document.getElementById("user");
    const chats = document.getElementById("chat");
    users.style.display = "none";
    chats.style.display = "block";
  }
  function showUsers() {
    const users = document.getElementById("user");
    const chats = document.getElementById("chat");
    users.style.display = "block";
    chats.style.display = "none";
  }
  function handleChat(e) {
    if (e.target.textContent != room) {
      if (localStorage.getItem("prevBTN")) {
        const BTN = document.getElementById(
          `${localStorage.getItem("prevBTN")}`
        );
        BTN.style.backgroundColor = "#bfbdbd";
      }
      e.target.style.backgroundColor = "aqua";
      myEmitter.emit("newRoom", { room: e.target.textContent });
      socket.emit("changeRoom", {
        users,
        room: e.target.textContent,
        user: localStorage.getItem("user"),
        currentRoom: room,
      });
      localStorage.setItem("room", e.target.textContent);
      localStorage.setItem("prevBTN", e.target.id);
    }
  }

  function handleModal() {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("myBtn");
    const Inp = document.getElementById("Inp");

    btn.onclick = function () {
      modal.style.display = "block";
    };
    const span = document.getElementById("close");

    span.onclick = function () {
      modal.style.display = "none";
      Inp.value = "";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
        Inp.value = "";
      }
    };
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.buttons}>
        <button onClick={showChats}>Chats</button>

        <button value={"gdsg"} onClick={showUsers}>
          Users
        </button>
      </div>

      <div id="user" className={styles.first}>
        <h4 className={styles.header}>Users</h4>
        <ul className={styles.users}>
          {users.map((el) => {
            if (localStorage.getItem("user") != el.user) {
              return <li key={el.socketID}>{el.user}</li>;
            }
          })}
        </ul>
      </div>

      <div id="chat" className={styles.second}>
        <h4 className={styles.header}>Chats</h4>

        <ul className={styles.users}>
          <div>
            <li>
              <button className={styles.Mybutton} onClick={handleModal} id="myBtn">
                Создать чат
              </button>
            </li>
          </div>
          {rooms.map((el, index) => (
            <li>
              <button className={index===0?styles.MyButton:styles.MyButton2}
                onClick={handleChat}
                key={`Btn${index}`}
                id={`Btn${index}`}
              >
                {el}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
