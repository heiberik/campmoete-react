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

    const [messageText, setMessageText] = useState("")
    const [user, setUser] = useState("")
    const [usernameChosen, setUsernameChosen] = useState(false)
    const [notMessage, setNotMessage] = useState("")
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])

    useEffect(() => {
        if (usernameChosen) document.getElementsByClassName("form_input")[0].blur();
        else document.getElementsByClassName("form_input")[0].focus();
    }, [usernameChosen])

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowSize([window.innerWidth, window.innerHeight])
        })
    }, [])

    

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
                <Notification message={notMessage} messageHandler={setNotMessage} />
                <WriteMessageBox
                    messageText={messageText}
                    sendMessageHandler={sendMessageHandler}
                    messageTextChangedhandler={messageTextChangedhandler}
                    usernameChosen={usernameChosen}
                    setUsernameHandler={setUsernameHandler} />
                <TooSmallScreen windowSize={windowSize} color1="#e66465" color2="purple" />
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
            <Players messagesService={messagesService} userOriginal={user} />
            <Areas messagesService={messagesService} />
            <Pillars messagesService={messagesService} />
            <Notification message={notMessage} messageHandler={setNotMessage} />
            <CountDown messagesService={messagesService} />
            <DeadUsers messagesService={messagesService} />
            <Score messagesService={messagesService} />
            <Skammekroken messagesService={messagesService} />
            <Bullets messagesService={messagesService} />
            <TooSmallScreen windowSize={windowSize} color1="#e66465" color2="purple" />
        </div>
    )
}

export default App
