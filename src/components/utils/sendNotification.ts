import WebSocket from 'ws';

let socket = new WebSocket('ws://localhost:9000');

socket.onopen = () => {
  console.log('WebSocket connection established for notification utility');
};

type props={
    username:string,
    content:string,
}
export const sendNotification = ({username, content}:props) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ username, content }));
  } else {
    console.error('WebSocket is not open. ReadyState:', socket.readyState);
  }
};
