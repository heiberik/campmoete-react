import React from 'react';
import { useState, useEffect } from 'react'

import messagesService from "./services/messages"
import MessagesList from "./components/MessagesList"
import Header from "./components/Header"
import WriteMessageBox from "./components/WriteMessageBox"
import Campfire from './components/Campfire'
import Players from './components/Players'
import Notification from './components/Notification'
import Areas from './components/Areas'
import TooSmallScreen from './components/TooSmallScreen'
import "./css/App.css"


// TODO
// ikke legge til tomme mld.

const App = () => {

    const [messages, setMessages] = useState([])
    const [messageText, setMessageText] = useState("")
    const [user, setUser] = useState("")
    const [users, setUsers] = useState([])
    const [notMessage, setNotMessage] = useState("")
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])
    const [shield, setShield] = useState(false)
    const [map, setMap] = useState(new Map())

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowSize([window.innerWidth, window.innerHeight])
        })
    }, [])

    const sendMessageHandler = (event) => {
        event.preventDefault()
        if (messageText.replace(/\s+/g, '') !== "") {
            const newMessage = {
                message: messageText
            }

            messagesService
                .sendMessage(newMessage)
                .then((msg) => {
                    setMessages(messages.concat(msg))
                    setMessageText("")
                })
        }
        else {
            setNotMessage("Message cannot be empty")
            setMessageText("")
        }
    }

    const messageTextChangedhandler = (event) => {
        setMessageText(event.target.value)
    }

    const setUsernameHandler = (event) => {
        event.preventDefault()

        if (messageText.replace(/\s+/g, '') === "") {
            setNotMessage("Username cannot be empty")
            setMessageText("")
        }
        else if (messageText === "Beowulf"){
            setNotMessage("Username cannot be a helt som dreper Grendel")
            setMessageText("")
        }
        else if (messageText.length > 20) {
            setNotMessage("Username cannot be over 20 characters long")
            setMessageText("")
        }
        else {
            messagesService
                .getAllMessages()
                .then((msgs) => setMessages(msgs))

            messagesService
                .connectSocket((message) => {
                    setMessages(msgs => {
                        const check = msgs.find(msg => msg.number === message.number)
                        if (!check) return msgs.concat(message)
                        return msgs
                    })
                })

            messagesService
                .getUsers((users) => setUsers(users))

            messagesService
                .getUser((user) => setUser(user))

            messagesService
                .listenMessagesReset(() => setMessages([]))

            messagesService
                .sendUsername(messageText)
            setMessageText("")

            window.addEventListener('keydown', (event) => {
    
                if (event.target.tagName.toUpperCase() === 'INPUT') return
                if (![65, 83, 87, 68, 32].includes(event.keyCode)) return
                
                let newMap = map
                setMap(m => {
                    newMap = new Map(m)
                    newMap.set(event.keyCode, true)
                    return newMap
                })
    
                if (newMap.get(32)) { // Space
                    setShield(() => {
                        messagesService.setShield(true)
                        return true
                    })
                }
                else {
                    setUser(u => {
        
                        let pos = [u.playerPosX, u.playerPosY]
                        let newPos = [u.playerPosX, u.playerPosY]
    
                        if (newMap.get(65) && newMap.get(83)) newPos = [pos[0] - 1, pos[1] + 1]
                        else if (newMap.get(87) && newMap.get(65)) newPos = [pos[0] - 1, pos[1] - 1]
                        else if (newMap.get(87) && newMap.get(68)) newPos = [pos[0] + 1, pos[1] - 1]
                        else if (newMap.get(83) && newMap.get(68)) newPos = [pos[0] + 1, pos[1] + 1]
                        else if (newMap.get(87)) newPos = [pos[0], pos[1] - 2]
                        else if (newMap.get(65)) newPos = [pos[0] - 2, pos[1]]
                        else if (newMap.get(83)) newPos = [pos[0], pos[1] + 2]
                        else if (newMap.get(68)) newPos = [pos[0] + 2, pos[1]]
                        messagesService.sendCoords(newPos)
    
                        const newUser = {
                            ...u,
                            playerPosX: newPos[0],
                            playerPosY: newPos[1],
                        }

                        return newUser
                    })
                }
            })
    
            window.addEventListener('keyup', (event) => {
    
                if (![65, 83, 87, 68, 32].includes(event.keyCode)) return
    
                let newMap = map
                setMap(m => {
                    newMap = new Map(m)
                    newMap.set(event.keyCode, false)
                    return newMap    
                })

                if (!newMap.get(32)) { // Space
                    setShield(() => {
                        messagesService.setShield(false)
                        return false
                    })
                }
            })
        }
    }

    const style = {
        display: "flex",
        flexFlow: "column",
        height: "100vh",
        maxHeight: "100vh",
        margin: "0px",
        padding: "0px",
    }

    return (
        <div style={style}>
            <Header text="CAMPMØTE" />
            <MessagesList
                list={messages}
                users={users} />
            <WriteMessageBox
                messageText={messageText}
                sendMessageHandler={sendMessageHandler}
                messageTextChangedhandler={messageTextChangedhandler}
                user={user}
                setUsernameHandler={setUsernameHandler} />
            <Campfire messages={messages} />
            <Players
                users={users}
                user={user}
                shield={shield} />
            <Areas
                msgService={messagesService}
                users={users}
                user={user} />
            <Notification
                message={notMessage}
                messageHandler={setNotMessage} />
            <TooSmallScreen size={windowSize} />
        </div>
    )
}

export default App
