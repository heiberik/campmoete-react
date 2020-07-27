import React from "react"
import { useState, useEffect } from 'react'
import Message from './Message'
import Campfire from './Campfire'

const Messages = React.memo(({ messagesService }) => {

    const [messages, setMessages] = useState([])

    useEffect(() => {

        const messagesList = []

        messagesService.getGameState((gameState) => {
            if (gameState.newMessages) {
                messagesList.push(gameState.messages)
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
        }, 1000 / 55);


    }, [messagesService])

    const style = {
        listStyleType: "none",
        margin: "0px",
        padding: "0px",
    }

    return (
        <>
            <Campfire messages={messages} />
            <ul style={style}>
                {messages.map(msg => <Message key={msg.number} message={msg} />)}
            </ul>
        </>
    )
})

export default Messages