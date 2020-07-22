import React from "react"
import { useState, useEffect } from 'react'
import Message from './Message'
import Campfire from './Campfire'

const Messages = ({ messagesService }) => {

    const [messages, setMessages] = useState([])


    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.newMessages) {
                setMessages(gameState.messages)
            }
        })
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
}

export default Messages