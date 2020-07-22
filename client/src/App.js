import React from 'react'
import { useState, useEffect } from 'react'

import messagesService from "./services/messages"
import Messages from "./components/Messages"
import Header from "./components/Header"
import WriteMessageBox from "./components/WriteMessageBox"
import Players from './components/Players'
import Notification from './components/Notification'
import Areas from './components/Areas'
import TooSmallScreen from './components/TooSmallScreen'
import Pillars from "./components/Pillars"
import CountDown from "./components/CountDown"
import DeadUsers from "./components/DeadUsers"
import Score from "./components/Score"
import Background from "./components/Background"
import Skammekroken from "./components/Skammekroken"
import Bullets from "./components/Bullets"

import "./css/App.css"

const App = () => {

    console.log("render APP")

    const [messageText, setMessageText] = useState("")
    const [user, setUser] = useState("")
    const [usernameChosen, setUsernameChosen] = useState(false)
    const [notMessage, setNotMessage] = useState("")

    useEffect(() => {
        if (usernameChosen) {
            document.getElementsByClassName("form_input")[0].blur();
            handleUserInput()
        }
        else {
            document.getElementsByClassName("form_input")[0].focus();
        }
    }, [usernameChosen])

    const handleUserInput = () => {

        const pm = {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false,
            shoot: null,
        }

        const keyDownHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") return
            if (e.keyCode === 68 || e.keyCode === 38) pm.right = true
            else if (e.keyCode === 65 || e.keyCode === 37) pm.left = true
            else if (e.keyCode === 87 || e.keyCode === 39) pm.up = true
            else if (e.keyCode === 83 || e.keyCode === 40) pm.down = true
            else if (e.keyCode === 32) pm.space = true
        }

        let setFalse = false
        const keyUpHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") return
            if (e.keyCode === 68 || e.keyCode === 38) pm.right = false
            else if (e.keyCode === 65 || e.keyCode === 37) pm.left = false
            else if (e.keyCode === 87 || e.keyCode === 39) pm.up = false
            else if (e.keyCode === 83 || e.keyCode === 40) pm.down = false
            else if (e.keyCode === 32) pm.space = false
            setFalse = true
        }

        const mouseClickHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") return
            const x = (e.clientX / window.innerWidth) * 100
            const y = (e.clientY / window.innerHeight) * 100
            pm.shoot = [x, y]
        }

        document.addEventListener('keydown', keyDownHandler, false)
        document.addEventListener('keyup', keyUpHandler, false)
        document.addEventListener('click', mouseClickHandler, false)

        setInterval(() => {
            if (pm.up || pm.down || pm.left || pm.right || pm.space || setFalse || pm.shoot) {
                messagesService.sendPlayerMovement(pm)
                pm.shoot = null
                setFalse = false
            }
        }, 1000 / 49);
    }

    const sendMessageHandler = (event) => {
        event.preventDefault()
        if (messageText.replace(/\s+/g, '') !== "") {
            messagesService.sendMessage(messageText)
            setMessageText("")
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
        else if (messageText === "Beowulf") {
            setNotMessage("Username cannot be a helt som dreper Grendel")
            setMessageText("")
        }
        else if (messageText.length > 20) {
            setNotMessage("Username cannot be over 20 characters long")
            setMessageText("")
        }
        else if (messageText.length < 3) {
            setNotMessage("Username must be at least 3 characters long")
            setMessageText("")
        }
        else {
            messagesService.getUser((u) => {
                if (u.id === "usernameTaken") {
                    setNotMessage("Username taken!")
                    setMessageText("")
                }
                else {
                    setMessageText("")
                    setUser(u)
                    setUsernameChosen(true)
                }
            })
            messagesService.sendUsername(messageText)
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

    if (!usernameChosen) {
        return (
            <div style={style}>
                <Header text="CAMPMØTE" />
                <Background color1="#e66465" color2="purple" />
                <WriteMessageBox
                    messageText={messageText}
                    sendMessageHandler={sendMessageHandler}
                    messageTextChangedhandler={messageTextChangedhandler}
                    usernameChosen={usernameChosen}
                    setUsernameHandler={setUsernameHandler} />
                <TooSmallScreen color1="#e66465" color2="purple" />
            </div>
        )
    }
    else return (
        <div style={style}>
            <Header text="CAMPMØTE" />
            <Background color1="#e66465" color2="purple" />
            <Messages messagesService={messagesService} />
            <WriteMessageBox
                messageText={messageText}
                sendMessageHandler={sendMessageHandler}
                messageTextChangedhandler={messageTextChangedhandler}
                usernameChosen={usernameChosen}
                setUsernameHandler={setUsernameHandler} />
            <Players messagesService={messagesService} user={user} />
            <Areas messagesService={messagesService} />
            <Pillars messagesService={messagesService} />
            <Notification message={notMessage} messageHandler={setNotMessage} />
            <CountDown messagesService={messagesService} />
            <DeadUsers messagesService={messagesService} />
            <Score messagesService={messagesService} />
            <Skammekroken messagesService={messagesService} />
            <Bullets messagesService={messagesService} />
            <TooSmallScreen color1="#e66465" color2="purple" />
        </div>
    )
}

export default App
