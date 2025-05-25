// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: http });

let clients = [];

wss.on("connection", function connection(ws) {
  clients.push(ws);

  ws.on("message", function incoming(message) {
    // 將訊息轉發給其他客戶端
    clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", function () {
    clients = clients.filter((client) => client !== ws);
  });
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
