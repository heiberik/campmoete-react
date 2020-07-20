import React from 'react'
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
import Pillars from "./components/Pillars"
import CountDown from "./components/CountDown"
import DeadUsers from "./components/DeadUsers"
import Score from "./components/Score"
import Background from "./components/Background"

import "./css/App.css"


const App = () => {

    const [messageText, setMessageText] = useState("")
    const [user, setUser] = useState("")
    const [usernameChosen, setUsernameChosen] = useState(false)
    const [notMessage, setNotMessage] = useState("")
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])

    const [gamestate, setGamestate] = useState({
        messages: [],
        users: [],
        numbersDeleteEvent: [],
        numbersGameEvent: [],
        countDown: -1,
        deadUsers: [],
        pillars: [],
        currentScore: 0,
        highScore: 0,
    })

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
        else {
            messagesService.getUser((u) => {
                setMessageText("")
                setUsernameChosen(true)
                setUser(u)
            })
            messagesService.sendUsername(messageText)

            messagesService
                .getGameState((gameState) => {                    
                    setGamestate({
                        messages: gameState.messages,
                        users: gameState.users,
                        numbersDeleteEvent: gameState.numbersDeleteEvent,
                        numbersGameEvent: gameState.numbersGameEvent,
                        countDown: gameState.countDown,
                        deadUsers: gameState.deadUsers,
                        pillars: gameState.pillars,
                        currentScore: gameState.currentScore,
                        highScore: gameState.highScore,
                    })
                })

            const pm = {
                up: false,
                down: false,
                left: false,
                right: false,
                space: false
            }

            const keyDownHandler = (e) => {
                if (e.target.tagName.toUpperCase() === "INPUT") return
                if (e.keyCode === 68) pm.right = true
                else if (e.keyCode === 65) pm.left = true
                else if (e.keyCode === 87) pm.up = true
                else if (e.keyCode === 83) pm.down = true
                else if (e.keyCode === 32) pm.space = true
            }

            let setFalse = false
            const keyUpHandler = (e) => {
                if (e.target.tagName.toUpperCase() === "INPUT") return
                if (e.keyCode === 68) pm.right = false
                else if (e.keyCode === 65) pm.left = false
                else if (e.keyCode === 87) pm.up = false
                else if (e.keyCode === 83) pm.down = false
                else if (e.keyCode === 32) pm.space = false
                setFalse = true
            }

            document.addEventListener('keydown', keyDownHandler, false)
            document.addEventListener('keyup', keyUpHandler, false)

            setInterval(() => {
                if (pm.up || pm.down || pm.left || pm.right || pm.space || setFalse) {
                    messagesService.sendPlayerMovement(pm)
                    setFalse = false
                }
            }, 1000 / 60);
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
            <Header
                text="CAMPMØTE" />
            <Background
                color1="#e66465"
                color2="purple" />
            <MessagesList
                list={gamestate.messages} />
            <WriteMessageBox
                messageText={messageText}
                sendMessageHandler={sendMessageHandler}
                messageTextChangedhandler={messageTextChangedhandler}
                usernameChosen={usernameChosen}
                setUsernameHandler={setUsernameHandler} />
            <Campfire
                messages={gamestate.messages} />
            <Players
                users={gamestate.users}
                user={user} />
            <Areas
                usernameChosen={usernameChosen}
                numbersDeleteEvent={gamestate.numbersDeleteEvent}
                numbersGameEvent={gamestate.numbersGameEvent} />
            <Pillars
                pillars={gamestate.pillars} />
            <Notification
                message={notMessage}
                messageHandler={setNotMessage} />
            <CountDown
                countDown={gamestate.countDown} />
            <DeadUsers
                deadUsers={gamestate.deadUsers} />
            <Score
                highscore={gamestate.highScore}
                currentscore={gamestate.currentScore}
                usernameChosen={usernameChosen} />
            <TooSmallScreen
                size={windowSize} />
        </div>
    )
}

export default App
