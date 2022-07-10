// eslint-disable-next-line no-undef
const socket = io.connect('http://localhost:3000');

const message = document.getElementById('message-input');
const sendMsg = document.getElementById('send-message');
const msgSound = document.getElementById('notification-sound');
const user = document.getElementById('username-input');
const sendUser = document.getElementById('send-username');
const displayMsg = document.getElementById('display-message');
const typingLabel = document.getElementById('typing-label');
const chatWindow = document.getElementById('chat-window');
const usersCounter = document.getElementById('users-counter');
const msgErr = document.getElementById('message-error');
const userErr = document.getElementById('username-error');
const join = document.getElementById('you-joined');
const chat = document.getElementById('chat');
const login = document.getElementById('login-page');


function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

sendUser.addEventListener('click', () => {
  if (user.value === null || user.value.trim().length === 0) {
    userErr.innerHTML = '🚨 Name is required!';
    return;
  }

  userErr.innerHTML = '';
  login.style.display = 'none';
  chat.style.display = 'block';
  join.innerHTML = '<p>You have joined the chat<p>';
  socket.emit('new-user', user.value);
});

sendMsg.addEventListener('click', () => {
  if (message.value === null || message.value.trim().length === 0) {
    msgErr.innerHTML = '🚨 Message is required!';
    return;
  }
  console.log(message)
  const div = document.createElement('div');
  div.classList.add('right');
  div.innerHTML = `<strong>Me</strong> <p>${message.value}</p> <span> ${formatAMPM(new Date)} </span>`;
  displayMsg.appendChild(div);
  socket.emit('new-message', {
    message: message.value,
    username: user.value,
  });
  message.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;

});

message.addEventListener('keypress', () => {
  socket.emit('is-typing', user.value);
});


socket.on('user-connected', (username) => {
  const div = document.createElement('div');
  div.classList.add('left');
  div.innerHTML = `<strong>${username}</strong>: online`;
  displayMsg.appendChild(div);
  // chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  msgSound.play();
});

socket.on('broadcast', (number) => {
  usersCounter.innerHTML = number;
});

socket.on('new-message', (data) => {
  const div = document.createElement('div');
  div.classList.add('left');
  div.innerHTML = `<strong>${data.username}</strong> <p>${data.message}</p> <span> ${formatAMPM(new Date)} </span>`;
  displayMsg.appendChild(div);
  // chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  msgSound.play();
});

socket.on('is-typing', (username) => {
  typingLabel.innerHTML = `<div>${username}...</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on('user-disconnected', (username) => {
  if (username == null) {
    const div = document.createElement('div');
    div.classList.add('left');
    div.innerHTML = `<p>Unlogged user has disconnected!</p>`;
    displayMsg.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } else {
    const div = document.createElement('div');
    div.classList.add('left');
    div.innerHTML = `<p><strong>${username}</strong>: offline</p>`;
    displayMsg.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    msgSound.play();
  }
});
