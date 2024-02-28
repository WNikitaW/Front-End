import { useEffect, useState } from "react";
import Body from "./components/body/body";
import MassageBlock from "./components/massage-block/massage-block";
import SideBar from "./components/sidebar/sidebar.jsx";
import styles from "./styles.module.css";
import { myEmitter } from "../chat/components/sidebar/eventEmitter.js";
import Modal from "./modal.jsx";

function ChatPage({ socket }) {
  const [messages, SetMessages] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("Messages") && localStorage.getItem("room")) {
      try {
        const storedMessages = JSON.parse(localStorage.getItem("Messages"));
        const room = localStorage.getItem("room");

        if (storedMessages && storedMessages[room]) {
          SetMessages(storedMessages[room]);
        } else {
          console.warn(`No messages found for room "${room}"`);
        }
      } catch (error) {
        console.error("Error parsing stored messages:", error);
      }
    }
  }, []);
  const [status, SetStatus] = useState("");
  const [obj, SetObj] = useState({});

  const handleNewUsers = (data) => {
    console.log("Received messages:", data);
    const newObj = { ...obj };
    if (newObj[data.room.toString()]) {
      newObj[data.room.toString()].push(data);
    } else {
      newObj[data.room.toString()] = [data];
    }

    SetObj(newObj);
    SetMessages(newObj[data.room]);

    localStorage.setItem("Messages", JSON.stringify(obj));
  };
  const getMessages = (data) => {
    const Messages = JSON.parse(localStorage.getItem("Messages"));
    if (Messages) {
      if (Messages[data.room] === undefined) {
        SetMessages([]);
      } else {
        SetMessages(Messages[data.room]);
      }
    }
  };
  useEffect(() => {
    myEmitter.on("newRoom", getMessages);
  }, [myEmitter]);
  useEffect(() => {
    socket.on("response", handleNewUsers);
    return () => {
      socket.off("response", handleNewUsers);
    };
  }, [messages, socket]);

  useEffect(() => {
    socket.on("responseTyping", (data) => {
      SetStatus(data);
      setTimeout(() => SetStatus(""), 2000);
    });
  }, [socket]);

  return (
    <div className={styles.chat}>
      <SideBar socket={socket}> </SideBar>

      <main className={styles.main}>
        <Body messages={messages} status={status} socket={socket}></Body>
        <Modal socket={socket}></Modal>
        <MassageBlock socket={socket}></MassageBlock>
      </main>
    </div>
  );
}

export default ChatPage;
