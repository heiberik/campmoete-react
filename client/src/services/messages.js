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

const setShield = (shield) => {
    socket.emit("setShield", {shield: shield})
}

const getUser = (callback) => {
    socket.on("sendUser", (data) => {
        callback(data)
    })
}

const getUsers = (callback) => {
    socket.on("sendUsers", (data) => {
        callback(data.users)
    })
}

const getGameState = (callback) => {
    socket.on("gameState", (data) => {
        callback(data)
    })
}


export default {
    getAllMessages: getAllMessages,
    sendMessage: sendMessage,
    sendUsername: sendUsername,
    getUsers: getUsers,
    getUser: getUser,
    setShield: setShield,
    sendPlayerMovement: sendPlayerMovement,
    getGameState: getGameState
}