import React from "react"
import AreaDelete from "./AreaDelete"
import AreaStartGame from "./AreaStartGame"
import AreaStartGunGame from "./AreaStartGunGame"
import AreaRandom from "./AreaRandom"
import { useState, useEffect } from 'react'

const Areas = React.memo(({ messagesService }) => {

    const [numbersDeleteEvent, setNumbersDeleteEvent] = useState([])
    const [numbersGameEvent, setNumbersGameEvent] = useState([])
    const [numbersGunGameEvent, setNumbersGunGameEvent] = useState([])
    const [gunGame, setGunGame] = useState(false)
    const [pillarGame, setPillarGame] = useState(false)


    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.numbersAreaChanged) {
                setNumbersGameEvent(gameState.numbersGameEvent)
                setNumbersDeleteEvent(gameState.numbersDeleteEvent)
                setNumbersGunGameEvent(gameState.numbersGunGameEvent)
            }
            if (gameState.gameInProgressChanged){
                setTimeout(() => {
                    setPillarGame(gameState.gameInProgress)
                    setGunGame(gameState.gunGameInProgress)
                }, 1000)
            }
        })
    }, [messagesService])

    if (gunGame || pillarGame) return null
    else return (
        <div>
            <AreaDelete numbersDeleteEvent={numbersDeleteEvent} />
            <AreaStartGame numbersGameEvent={numbersGameEvent} />
            <AreaStartGunGame numbersGunGameEvent={numbersGunGameEvent} />
            <AreaRandom />
        </div>
    )
})

export default Areas