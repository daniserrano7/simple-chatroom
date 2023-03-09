const wsUrl = "ws://" + window.location.hostname + ":8080";
const wsServer = new WebSocket(wsUrl);

const sendButton = document.getElementById("send");
const messageInput = document.getElementById("message-input");
const id = Date.now();

const getInputMessage = () => {
  if (!messageInput) {
    throw new Error("No input element found");
  }

  return messageInput.value;
};

const sendMessage = () => {
  const message = getInputMessage();
  console.log("Sending message: ", message);
  wsServer.send(JSON.stringify({ message, id }));
  messageInput.value = "";
  messageInput.focus();
};

const displayMessage = (messageId, message) => {
  const messagesElement = document.getElementById("messages");
  const newMessageElement = document.createElement("li");
  const formattedTime = new Date()
    .toLocaleTimeString()
    .split(":")
    .slice(0, -1)
    .join(":");
  newMessageElement.classList.add("message");
  messageId === id ? newMessageElement.classList.add("my-message") : null;
  newMessageElement.innerHTML = `
    <p>${message}</p>
    <span class="timestamp">${formattedTime}</span>
  `;

  messagesElement.appendChild(newMessageElement);
  messagesElement.scrollTo(0, messagesElement.scrollHeight);
};

wsServer.onopen = () => {
  sendButton.disabled = false;
};

wsServer.onmessage = (event) => {
  const { data } = event;
  const { id: messageId, message } = JSON.parse(data);
  console.log("Received message: ", message);
  displayMessage(messageId, message);
};

sendButton.addEventListener("click", sendMessage);
messageInput.focus();

// for (let i = 0; i < 100; i++) {
//   displayMessage(i, "Hello world");
// }
