const sqlHelper = require('../../helpers/sqlHelper');
const functionHelper = require('../../helpers/functionHelper')
var peers = {}
function socket(io){
    
    io.on('connection', (socket) => {
        socket.emit('hello new user', peers);


        //khi có user mới thì tạo room cho user đó bằn socket trong db
        socket.on('join socket id new user online', async (currentUser)=>{ //socketId
            console.log("currentUser", currentUser)
            await socket.join(currentUser.username)
            socket.username = currentUser.username;
            var listRoomOnline = await functionHelper.filterAndGetRoomOnline(io.sockets.adapter.rooms, currentUser);

            sqlHelper.emit(currentUser.username, 'everything ok', '', io);
            io.emit('new user connect', listRoomOnline);
        })

        socket.on('disconnect', async ()=>{
            var listRoomOnline = await functionHelper.filterAndGetRoomOnline(io.sockets.adapter.rooms, {username: socket.username});
            // console.log("user disconnect", io.sockets.adapter.rooms);
            socket.broadcast.emit('user disconnect', listRoomOnline);
        })
        
        socket.on('sender send message', async ({sender, message, idRoom})=>{ // {sender, message, idRoom}
            var isShowTimeMessageNearest = false;//thoi gian duoi message cua message gan nhat trong room
            var usersInGroup = await sqlHelper.getUserInRoom(idRoom)
            var messageNearest = await sqlHelper.getMessageNearest(idRoom);
            var isTimeLine = 1;//time line truoc block message, 1 is true in sql
            
            var date = new Date();


            if (messageNearest){
                isTimeLine = functionHelper.compareDate(date, messageNearest.updatedAt) === true ? 0 : 1
                isShowTimeMessageNearest = (sender == messageNearest.sender && isTimeLine == false);
            }

            sqlHelper.insertMessage(sender, idRoom, message, isTimeLine);

            usersInGroup.forEach((user)=>{
                sqlHelper.setUnRead({idRoom, receiver: user, isIncrease: true});
                sqlHelper.emit(user, 'server send message', {message, idRoom, sender}, io)
            })

            if (isShowTimeMessageNearest){
                sqlHelper.setIsShowTimeByMessageId(messageNearest.id);
            }
        })


        socket.on('client request video call', async function(data){
            var usersInGroup = await sqlHelper.getUserInRoom(data.idRoom);

            usersInGroup = usersInGroup.filter(user=>{
                return user !== data.currentUser;
            })
            usersInGroup.forEach((user)=>{
                sqlHelper.emit(user, 'server request video call', data, io)
            })
        })

        socket.on('set unread field', function(data){
            sqlHelper.setUnRead(data);
        })

        socket.on('sender send video call', async function({sender, idRoom}){
            var usersInGroup = await sqlHelper.getUserInRoom(idRoom)
            usersInGroup.forEach((user)=>{
                if (user !== sender){
                    sqlHelper.emit(user, 'server send video call', {idRoom}, io);
                }
            })
        })

        socket.on('new user connect room', async function({peerId, idRoom, user}){
            socket.join(idRoom);
            peers[peerId] = user;
            socket.to(idRoom).broadcast.emit('user connected', {remotePeerId: peerId, user});
            console.log(io.sockets.adapter.rooms)
        })
    });


}

module.exports = socket;