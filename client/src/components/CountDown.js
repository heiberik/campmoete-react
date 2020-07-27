import React from "react"
import { useState, useEffect } from 'react'

const CountDown = React.memo(({ messagesService }) => {

    const [countDown, setCountDown] = useState(-1)

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

    if (countDown === 0){
        return (
            <div style={countDownStyle}> ;) </div>
        )
    }
    if (countDown > -1) {
        return (
            <div style={countDownStyle}> {countDown} </div>
        )
    }
    else return null
})

export default CountDown