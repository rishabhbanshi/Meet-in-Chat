const express=require('express');
const path= require('path');
const http =require('http');
const socketio=require('socket.io');
const formatMessage =require('./utils/messages');
const {userJoin,
    getcurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const app=express();
const server = http.createServer(app);
const io=socketio(server);


app.use(express.static(path.join(__dirname,'public')));


const botname='Meetin Bot';



//Run when client connects
io.on('connection',socket =>{
    socket.on('joinRoom',({username ,room})=>{
    console.log('user ---->', username, 'room --->', room)
     const user=userJoin(socket.id,username,room);
     console.log('user return --->', user);
     socket.join(user.room);

     //Welcome mssg
     socket.emit('message',formatMessage(botname,'Welcome to Meetin'));

     //Broadcast
     socket.broadcast
        .to(user.room)
        .emit(
            'message',formatMessage(botname,`${user.username} has joined the chat`)
         );

       //Send users Info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            user:getRoomUsers(user.room)
        });
    });

    //EMIT CHAT
    socket.on('chatMessage',msg =>{
        const user = getcurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
//Disconnect
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
          io.to(user.room).emit(
              'message',
              formatMessage(botname,`${user.username} has left the chat`)
              );  

        io.to(user.room).emit('roomUsers', {
            room:user.room,
            user:getRoomUsers(user.room)
        });
        }           });
});


//SERVER 
const PORT = process.env.PORT  || 3000 ;

server.listen(PORT, ()=> console.log(`SERVER IS AT ${PORT}`));