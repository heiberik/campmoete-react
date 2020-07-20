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
import "./css/App.css"


const App = () => {


    const [messageText, setMessageText] = useState("")
    const [user, setUser] = useState("")
    const [usernameChosen, setUsernameChosen] = useState(false)
    const [notMessage, setNotMessage] = useState("")
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])

    /*
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [numbersDeleteEvent, setNumbersDeleteEvent] = useState(0)
    const [numbersGameEvent, setNumbersGameEvent] = useState(0)
    const [countDown, setCountDown] = useState(-1)
    const [usersDead, setUsersDead] = useState([])
    const [pillars, setPillars] = useState([])
    const [currentscore, setCurrentscore] = useState(0)
    const [highscore, setHighscore] = useState(0)
    const [newHighscore, setNewHighscore] = useState(false)
    */

    const [gamestate, setGamestate] = useState({
        messages: [],
        users: [],
        numbersDeleteEvent: [],
        numbersGameEvent: [],
        countDown: -1,
        usersDead: [],
        pillars: [],
        currentScore: 0,
        highScore: 0,
    })

    console.log("render")

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
                        usersDead: gameState.deadUsers,
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

                    /*
                    setUser(u => {

                        let newPosX = u.playerPosX
                        let newPosY = u.playerPosY

                        if (pm.up && pm.left) {
                            newPosX = newPosX - .25
                            newPosY = newPosY - .25
                        }
                        else if (pm.up && pm.right) {
                            newPosX = newPosX + .25
                            newPosY = newPosY - .25
                        }
                        else if (pm.down && pm.left) {
                            newPosX = newPosX - .25
                            newPosY = newPosY + .25
                        }
                        else if (pm.down && pm.right) {
                            newPosX = newPosX + .25
                            newPosY = newPosY + .25
                        }
                        else if (pm.up) newPosY = newPosY - .5
                        else if (pm.down) newPosY = newPosY + .5
                        else if (pm.left) newPosX = newPosX - .5
                        else if (pm.right) newPosX = newPosX + .5

                        const newUser = {
                            ...u,
                            shield: pm.space,
                            playerPosX: newPosX,
                            playerPosY: newPosY,
                        }

                        return newUser
                    })
                    */

                    setFalse = false
                }
            }, 1000 / 40);
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
                list={gamestate.messages}
                users={gamestate.users} />
            <WriteMessageBox
                messageText={messageText}
                sendMessageHandler={sendMessageHandler}
                messageTextChangedhandler={messageTextChangedhandler}
                usernameChosen={usernameChosen}
                setUsernameHandler={setUsernameHandler} />
            <Campfire messages={gamestate.messages} />
            <Players
                users={gamestate.users}
                user={user} />
            <Areas
                currentscore={gamestate.currentscore}
                newHighscore={gamestate.newHighscore}
                highscore={gamestate.highscore}
                usersDead={gamestate.usersDead}
                countDown={gamestate.countDown}
                usernameChosen={usernameChosen}
                numbersDeleteEvent={gamestate.numbersDeleteEvent}
                numbersGameEvent={gamestate.numbersGameEvent} />
            <Pillars
                pillars={gamestate.pillars} />
            <Notification
                message={notMessage}
                messageHandler={setNotMessage} />
            <TooSmallScreen size={windowSize} />
        </div>
    )
}

export default App
