const express = require('express')
const app = express()
const port = process.env.PORT || 3090;

const rooms = [
    {
        id: 'practices1',
        label: 'Práctica1'
    },
    {
        id: 'practices2',
        label: 'Práctica2'
    }
    ,
    {
        id: 'practices3',
        label: 'Práctica3'
    }
];

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index', { rooms, currentRoom: rooms[0] });
});

app.get('/rooms/:room', (req, res) => {
    const room = rooms.find(room => room.id == req.params.room) || rooms[0];
    res.render('index', { rooms, currentRoom: room });
})

server = app.listen(port)

//socket.io instantiation
const io = require("socket.io")(server)

rooms.forEach(room => {
    const nsp = io.of(`/${room.id}`);

    //listen on every connection
    nsp.on('connection', (socket) => {
        //default username
        socket.username = "Anonymous"

        //listen on change_username
        socket.on('change_username', (data) => {
            socket.username = data.username
        })

        //listen on new_message
        socket.on('new_message', (data) => {
            //broadcast the new message
            nsp.emit('new_message', {message : data.message, username : socket.username});
        })

        //listen on typing
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {username : socket.username})
        })
    })
});