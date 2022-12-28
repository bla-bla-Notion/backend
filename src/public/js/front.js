const socket = io('https://dev-jn.shop');

socket.on('nickname', (user, list) => {
  console.log(user, list);
});

socket.on('disconnectedUser', (user, list) => {
  console.log(user, list);
});

const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');

function handleSubmit(event) {
  event.preventDefault();
  const text = messageForm.querySelector('textarea');
  socket.emit('message', { text: text.value });
}

socket.on('message', message => {
  const li = document.createElement('li');
  li.innerText = message.text;
  const text = messageForm.querySelector('textarea');
  text.innerText = message.text;
  messageList.append(li);
});

messageForm.addEventListener('submit', handleSubmit);
