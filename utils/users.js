const users=[];

//Join user to chat
function userJoin(id,username,room){
    
    const user={id,username,room};
    
    users.push(user);

    return user;
}

function getcurrentUser(id){

    return users.find(user=>user.id === id)
}

function userLeave(id){
    const index=users.findIndex(user=>user.id===id)

    if(index !==-1){
        return users.splice(index,1)[0];
    }
}

function getRoomUsers(room){
    console.log('room --->', room);
    console.log('users in get --->',users)

    let filterUser = users.filter(user=>user.room===room);

    console.log('filter user --->', filterUser);
    return filterUser;
}

module.exports={
    userJoin,
    getcurrentUser,
    userLeave,
    getRoomUsers
};