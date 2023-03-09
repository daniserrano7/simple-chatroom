const wsUrl = "ws://localhost:8080";
const wsServer = new WebSocket(wsUrl);

const getInputElement = () => {
  const element = document.getElementById("message");

  if (!element) {
    throw new Error("No input element found");
  }

  return element;
};

const getInputMessage = () => {
  const inputElement = getInputElement();

  if (!inputElement) {
    throw new Error("No input element found");
  }

  return inputElement.value;
};

const sendMessage = () => {
  const message = getInputMessage();
  const inputElement = getInputElement();
  console.log("Sending message: ", message);
  wsServer.send(message);
  inputElement.value = "";
};

const sendButton = document.getElementById("send");
sendButton.addEventListener("click", sendMessage);

wsServer.onopen = () => {
  sendButton.disabled = false;
};

wsServer.onmessage = (event) => {
  const { data } = event;
  console.log("Received message: ", data);
};
