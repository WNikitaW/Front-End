const express = require("express");
const app = express();
const PORT = 5500;
const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello",
  });
});

const rooms = {};
const arrRooms = ["GlobalChat", "Chat2"];

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("joinRoom", (data) => {
    if (!rooms[data.room]) {
      rooms[data.room] = [];
    }

    socket.join(data.room);
    rooms[data.room].push({
      user: data.user,
      socketID: socket.id,
      room: data.room,
    });
    socketIO.to(data.room).emit("newUser", rooms[data.room]);
    console.log(`Sent newUsers event to room ${data.room}`);
    console.log(rooms[data.room]);

    socketIO.sockets
      .in(data.room)
      .emit("responseNewUser", { room: data.room, users: rooms[data.room] });
  });

  socket.on("message", (data) => {
    console.log(data);
    socketIO.sockets.in(data.room).emit("response", data);
  });

  socket.on("typing", (data) => {
    console.log(data.data);
    if (data.room) {
      socketIO.sockets.to(data.room).emit("responseTyping", data);
    }
  });
  socket.on("changeRoom", (data) => {
    let arr = data.users;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].user === data.user) {
        rooms[data.currentRoom].splice(i, 1);
      }
    }
    socketIO.sockets.in(data.currentRoom).emit("responseNewUser", {
      room: data.currentRoom,
      users: rooms[data.currentRoom],
    });
    socket.leave(data.currentRoom);
    if (!rooms[data.room]) {
      rooms[data.room] = [];
    }

    socket.join(data.room);
    rooms[data.room].push({
      user: data.user,
      socketID: socket.id,
      room: data.room,
    });
    socketIO.sockets.in(data.room).emit("responseNewUser", {
      room: data.room,
      users: rooms[data.room],
    });
  });

  socket.on("DeletingUser", (data) => {
    let arr = Array.from(rooms[data.room]);
    console.log("DeletingUser", arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].user === data.user) {
        rooms[data.room].splice(i, 1);
      }
    }
    socketIO.sockets
      .in(data.room)
      .emit("responseNewUser", { room: data.room, users: rooms[data.room] });
  });
  socket.on("getRoom", (name) => {
    Object.keys(rooms).forEach((room) => {
      const index = rooms[room].findIndex((user) => user.user === name);
      if (index !== -1) {
        socketIO.emit("returnRoom", rooms[room][0].room);
      }
    });
  });

  socket.on("createRoom", (data) => {
    if (data) {
      arrRooms.push(data);
    }
    socketIO.emit("Rooms", arrRooms);
  });

  socket.on("disconnect", () => {
    Object.keys(rooms).forEach((room) => {
      const index = rooms[room].findIndex(
        (user) => user.socketID === socket.id
      );
      if (index !== -1) {
        rooms[room].splice(index, 1);
        socketIO.to(room).emit("userDisconnected", socket.id);
      }
    });
  });

  socket.on("showUsers", (room) => {
    socketIO.sockets.in(room).emit("newUsers", rooms[room]);
  });
});

http.listen(PORT, () => {
  console.log("Server Working");
});
