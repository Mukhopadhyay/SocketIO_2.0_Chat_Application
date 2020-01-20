const socket = io.connect('http://socketio-2-chat-application.herokuapp.com:8000');

const messageBox = document.getElementById('messageBox');
const chatForm = document.getElementById('chatForm');
const message = document.getElementById('message');
const members = document.getElementById('active-members');
const memberHolder = document.getElementById('member-holder');

let appendMessage = (message, element, class_name) => {
    const div = document.createElement('div');

    if(class_name) {
        div.setAttribute('class', class_name);
    }

    div.innerHTML = message;
    element.append(div);
}

let refreshBox = (element, message) => {
    console.log(element.childNodes);

    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }

    console.log(element.childNodes);

}

const name = prompt('What is your name?');
appendMessage(`You joined!`, messageBox);

let mem;

//User list event
socket.on('user-list', (data) => {
    console.log(data);
    mem = Object.values(data);
        
    refreshBox(members, 'idk');

    mem.forEach(m => {
        appendMessage(m, members);
    });
})

//New user event
socket.emit('new-user', name);

//New user connected
socket.on('user-connected', (data) => {
    appendMessage(`${data} connected!`, messageBox, 'connected');
});

socket.on('user-disconnected', (data) => {

    if(data) {
        appendMessage(`${data} disconnected!`, messageBox);
        console.log(members.value);
    }
    
});

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    //Send the message as an event 'chat-message'
    socket.emit('chat-message', message.value);

    //Display your own message in the message-box
    appendMessage(`<b>You:</b> ${message.value}`, messageBox);

    message.value = '';
});

socket.on('new-message', data => {
    appendMessage(`<b>${data.name}:</b> ${data.message}`, messageBox);
});

