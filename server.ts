import { WebSocketServer, OPEN } from "ws";
import express from "express";

const app = express();
const PORT = 3000;

app.use("/", express.static("client"));

const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on("connection", (socket) => {
  socket.on("message", (serializedData) => {
    const data = JSON.parse(serializedData.toString());
    const { id, message } = data;
    console.log("WebSocket message received: ", message);

    wsServer.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.send(JSON.stringify({ id, message }));
      }
    });
  });
});

wsServer.on("upgrade", (request, socket, head) => {
  console.log("WebSocket upgrade request received");

  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
