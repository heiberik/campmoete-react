import React from "react"
import { useState, useEffect } from 'react'
import pic from "../images/dab.png"

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
        top: "40vh",
        left: "50vw",
        zIndex: "9999",
        cursor: "default",
    }

    const picStyle = {
        position: "absolute",
        top: "42vh",
        transform: "translateX(-50%)",
        left: "50vw",
        zIndex: "99999",
        cursor: "default",
        height: "14vh",
    }

    if (countDown === 0){
        return (
            <img src={pic} style={picStyle} alt="villager"/>
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