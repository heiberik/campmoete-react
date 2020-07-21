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
import Skammekroken from "./components/Skammekroken"

import "./css/App.css"


const App = () => {

    const [messageText, setMessageText] = useState("")
    const [user, setUser] = useState("")
    const [usernameChosen, setUsernameChosen] = useState(false)
    const [notMessage, setNotMessage] = useState("")
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [numbersDeleteEvent, setNumbersDeleteEvent] = useState([])
    const [numbersGameEvent, setNumbersGameEvent] = useState([])
    const [countDown, setCountDown] = useState([])
    const [deadUsers, setDeadUsers] = useState([])
    const [pillars, setPillars] = useState([])
    const [scoreCurrentHigh, setScoreCurrentHigh] = useState([0, 0])
    const [showSkammekroken, setShowSkammekroken] = useState(false)

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowSize([window.innerWidth, window.innerHeight])
        })
    }, [])

    useEffect(() => {
        if (usernameChosen) document.getElementsByClassName("form_input")[0].blur();
        else document.getElementsByClassName("form_input")[0].focus();
    }, [usernameChosen])


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
                    setUsernameChosen(chosen => {
                        if (!chosen) {
                            messagesService
                                .getGameState((gameState) => {

                                    if (gameState.freezeGameChanged){
                                        if (gameState.freezeGame){
                                            setShowSkammekroken(gameState.freezeGame)
                                        }
                                        else {
                                            setTimeout(() => {
                                                setShowSkammekroken(gameState.freezeGame)
                                            }, 3000)
                                        }
                                    }

                                    if (gameState.newMessages) {
                                        setMessages(gameState.messages)
                                    }

                                    if (gameState.usersChanged) {
                                        setUsers(gameState.users)
                                    }

                                    if (gameState.countDown > -2) {
                                        setCountDown(gameState.countDown)
                                    }

                                    if (gameState.pillarsChanged) {
                                        setPillars(gameState.pillars)
                                    }

                                    if (gameState.usersDeadChanged) {
                                        setDeadUsers(gameState.deadUsers)
                                    }

                                    if (gameState.scoreChanged) {
                                        setScoreCurrentHigh([gameState.currentScore, gameState.highScore])
                                    }

                                    if (gameState.numbersAreaChanged) {
                                        setNumbersGameEvent(gameState.numbersGameEvent)
                                        setNumbersDeleteEvent(gameState.numbersDeleteEvent)
                                    }
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
                                if (e.keyCode === 68  || e.keyCode === 38) pm.right = true
                                else if (e.keyCode === 65  || e.keyCode === 37) pm.left = true
                                else if (e.keyCode === 87  || e.keyCode === 39) pm.up = true
                                else if (e.keyCode === 83  || e.keyCode === 40) pm.down = true
                                else if (e.keyCode === 32) pm.space = true
                            }

                            let setFalse = false
                            const keyUpHandler = (e) => {
                                if (e.target.tagName.toUpperCase() === "INPUT") return
                                if (e.keyCode === 68  || e.keyCode === 38) pm.right = false
                                else if (e.keyCode === 65 || e.keyCode === 37) pm.left = false
                                else if (e.keyCode === 87  || e.keyCode === 39) pm.up = false
                                else if (e.keyCode === 83  || e.keyCode === 40) pm.down = false
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
                            }, 1000 / 50);
                        }
                        return true
                    })
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

    return (
        <div style={style}>
            <Header
                text="CAMPMØTE" />
            <Background
                color1="#e66465"
                color2="purple" />
            <MessagesList
                list={messages} />
            <WriteMessageBox
                messageText={messageText}
                sendMessageHandler={sendMessageHandler}
                messageTextChangedhandler={messageTextChangedhandler}
                usernameChosen={usernameChosen}
                setUsernameHandler={setUsernameHandler} />
            <Campfire
                messages={messages} />
            <Players
                users={users}
                user={user} />
            <Areas
                usernameChosen={usernameChosen}
                numbersDeleteEvent={numbersDeleteEvent}
                numbersGameEvent={numbersGameEvent} />
            <Pillars
                pillars={pillars} />
            <Notification
                message={notMessage}
                messageHandler={setNotMessage} />
            <CountDown
                countDown={countDown} />
            <DeadUsers
                deadUsers={deadUsers} />
            <Score
                score={scoreCurrentHigh}
                usernameChosen={usernameChosen} />
            <Skammekroken 
                showSkammekroken={showSkammekroken}/>
            <TooSmallScreen
                size={windowSize}
                color1="#e66465"
                color2="purple" />
        </div>
    )
}

export default App
