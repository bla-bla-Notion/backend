const socket = io();

socket.on('nickname', data => {
  console.log(data);
});

socket.on('disconnectedUser', data => {
  console.log(data);
});

const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');

function handleSubmit(event) {
  event.preventDefault();
  const text = messageForm.querySelector('textarea');
  socket.emit('message', { text: text.value });
}

socket.on('message', message => {
  console.log(message, message.text);
  const li = document.createElement('li');
  li.innerText = message.text;
  const text = messageForm.querySelector('textarea');
  text.innerText = message.text;
  messageList.append(li);
});

messageForm.addEventListener('submit', handleSubmit);
