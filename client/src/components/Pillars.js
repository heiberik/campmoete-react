import React from "react"
import Pillar from "./Pillar"
import { useState, useEffect } from 'react'

const Pillars = ({ messagesService }) => {

    const [pillars, setPillars] = useState([])

    useEffect(() => {

        const pillarsList = []

        messagesService.getGameState((gameState) => {
            if (gameState.pillarsChanged) {
                pillarsList.push(gameState.pillars)
            }
        })

        const changeGameState = () => {
            const pillrs = pillarsList.shift()
            if (pillrs) {
                window.requestAnimationFrame(() => setPillars(pillrs))
            }
        }

        setInterval(() => {
            changeGameState()
        }, 1000 / 60);


    }, [messagesService])

    return (
        <ul>
            {pillars.map(p => {
                return (
                    <Pillar
                        pillar={p}
                        key={p.posX} />
                )
            })}
        </ul>
    )
}

export default Pillars