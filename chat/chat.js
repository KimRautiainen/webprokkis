const socket = io();
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', () => {
    sendMessage();
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const message = input.value.trim();
    if (message !== "") {
        socket.emit('chat message', message);
        input.value = '';
    }
}

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    // Scroll to the bottom of the message box to show the latest message
    messages.scrollTop = messages.scrollHeight;
});