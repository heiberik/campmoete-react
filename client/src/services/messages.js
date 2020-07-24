import openSocketIO from "socket.io-client"
const socket = openSocketIO()


const getAllMessages = (callback) => {
    socket.emit("getAllMessages")
    socket.on("sendAllMessages" , (data) => {
        callback(data.messages)
    })
}

const sendMessage = (message) => {
    socket.emit("sendMessage", {message: message})
}

const sendPlayerMovement = (playerMovement) => {
    socket.emit('playerMovement', playerMovement)
}

const sendUsername = (username) => {
    socket.emit("setUsername", {username: username})
}

const getUser = (callback) => {
    socket.on("sendUser", (data) => {
        callback(data)
    })
}

const getGameState = (callback) => {
    socket.on("gameState", (data) => {
        callback(data)
    })
}

let time 
const pingServer = () => {
    time = new Date()
    socket.emit("pingServer", {heh: "heh"})
}

const getPongServer = (callback) => {
    socket.on("pongServer", (data) => {
        callback(new Date() - time)
    })
}


export default {
    getAllMessages: getAllMessages,
    sendMessage: sendMessage,
    sendUsername: sendUsername,
    getUser: getUser,
    sendPlayerMovement: sendPlayerMovement,
    getGameState: getGameState,
    pingServer: pingServer,
    getPongServer: getPongServer,
}