import openSocketIO from "socket.io-client"

const axios = require("axios")
const baseURL = "/api/messages"
const socket = openSocketIO()


const getAllMessages = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const sendMessage = (message) => {
    const request = axios.post(baseURL, message)
    return request.then(response => response.data)
}

const connectSocket = (callback) => {

    socket.on("broadcastMessages", (message) => {
        callback(message)
    })
}

const sendCoords = (pos) => {
    socket.emit("sendCoords", {posX: pos[0], posY: pos[1]}) 
}

const sendUsername = (username) => {
    socket.emit("setUsername", {username: username})
}

const setShield = (shield) => {
    socket.emit("setShield", {shield: shield})
}

const startDeleteEvent = (start) => {
    socket.emit("startDeleteEvent", {start: start})
}

const completeDeleteEvent = () => {
    socket.emit("completeDeleteEvent", {data:true})
}

const beginDeleteEvent = (callback) => {
    socket.on("beginDeleteEvent", (data) => {
        callback(data)
    })
}

const numbersDeleteEvent = (callback) => {
    socket.on("numbersDeleteEvent", (data) => {
        callback(data)
    })
}

const getUser = (callback) => {
    socket.on("sendUser", (data) => {
        callback(data)
    })
}

const listenMessagesReset = (callback) => {
    socket.on("messagesReset", (data) => {
        callback(data)
    })
}

const getUsers = (callback) => {
    socket.on("sendUsers", (data) => {
        callback(data.users)
    })
}


export default {
    getAllMessages: getAllMessages,
    sendMessage: sendMessage,
    connectSocket: connectSocket,
    sendCoords: sendCoords,
    sendUsername: sendUsername,
    getUsers: getUsers,
    getUser: getUser,
    setShield: setShield,
    startDeleteEvent: startDeleteEvent,
    beginDeleteEvent: beginDeleteEvent,
    numbersDeleteEvent: numbersDeleteEvent,
    listenMessagesReset: listenMessagesReset,
    completeDeleteEvent: completeDeleteEvent,
}