import React from "react"
import { useState, useEffect } from 'react'
import Message from './Message'
import Campfire from './Campfire'
import ChatBox from './ChatBox'

const Messages = React.memo(({ messagesService }) => {

    const [messages, setMessages] = useState([])
    const [gunGame, setGunGame] = useState(false)

    useEffect(() => {

        const messagesList = []

        messagesService.getGameState((gameState) => {
            if (gameState.newMessages) {
                messagesList.push(gameState.messages)
            }
            if (gameState.gameInProgressChanged) {
                setGunGame(gameState.gunGameInProgress)
            }
        })

        const changeGameState = () => {
            const msgs = messagesList.shift()
            if (msgs) {
                window.requestAnimationFrame(() => setMessages(msgs))
            }
        }

        setInterval(() => {
            changeGameState()
        }, 1000 / 60);


    }, [messagesService])

    const style = {
        listStyleType: "none",
        margin: "0px",
        padding: "0px",
    }

    if (gunGame) {
        return (
            <>
                <ul style={style}>  
                    {messages.filter(m => {return m.username === ""}).map(msg => <Message key={msg.number} message={msg} />)}
                </ul>
                <ChatBox messages={messages.filter(m => { return m.message !== "" })} />
            </>
        )
    }
    else return (
        <>
            <Campfire messages={messages} />
            <ul style={style}>
                {messages.map(msg => <Message key={msg.number} message={msg} />)}
            </ul>
            <ChatBox messages={messages.filter(m => { return m.message !== "" })} />
        </>
    )
})

export default Messages