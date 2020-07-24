import React from "react"
import { useState, useEffect } from 'react'

const CountDown = ({ messagesService }) => {

    const [countDown, setCountDown] = useState([])

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.countDown > -2) {
                setCountDown(gameState.countDown)
            }
        })
    }, [messagesService])

    const countDownStyle = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "10rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "black",
        top: "20vh",
        left: "50vw",
        zIndex: "9999",
        cursor: "default",
    }

    if (countDown > -1) {
        return (
            <div style={countDownStyle}> {countDown} </div>
        )
    }
    else return null
}

export default CountDown