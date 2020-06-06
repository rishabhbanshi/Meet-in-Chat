const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');



const{ username, room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
const socket=io();
socket.emit('joinRoom',{username,room});

//Get room and user info
socket.on('roomUsers',({room,user})=>{
    console.log('in roomuser --->', room, user)
    outputRoomname(room);
    outputUsers(user);
});

chatForm.addEventListener('submit', e=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;

    socket.emit('chatMessage',msg);
//clear text input
    e.target.elements.msg.value='';

    e.target.elements.msg.focus();
});

socket.on('message',message=>{
outputMessage(message);

chatMessages.scrollTop=chatMessages.scrollHeight;
});


//DOM message
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username}<span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomname(room){
    roomName.innerText=room;
}

function outputUsers(users){
    console.log(users)
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}