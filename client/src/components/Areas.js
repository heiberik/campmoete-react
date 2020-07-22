import React from "react"
import AreaDelete from "./AreaDelete"
import AreaStartGame from "./AreaStartGame"
import AreaStartGunGame from "./AreaStartGunGame"
import { useState, useEffect } from 'react'

const Areas = ({ messagesService }) => {

    const [numbersDeleteEvent, setNumbersDeleteEvent] = useState([])
    const [numbersGameEvent, setNumbersGameEvent] = useState([])
    const [numbersGunGameEvent, setNumbersGunGameEvent] = useState([])


    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.numbersAreaChanged) {
                setNumbersGameEvent(gameState.numbersGameEvent)
                setNumbersDeleteEvent(gameState.numbersDeleteEvent)
                setNumbersGunGameEvent(gameState.numbersGunGameEvent)
            }
        })
    }, [messagesService])

    return (
        <div>
            <AreaDelete numbersDeleteEvent={numbersDeleteEvent} />
            <AreaStartGame numbersGameEvent={numbersGameEvent} />
            <AreaStartGunGame numbersGunGameEvent={numbersGunGameEvent} />
        </div>
    )
}

export default Areas