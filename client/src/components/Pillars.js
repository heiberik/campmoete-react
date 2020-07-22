import React from "react"
import Pillar from "./Pillar"
import { useState, useEffect } from 'react'

const Pillars = ({ messagesService }) => {

    const [pillars, setPillars] = useState([])

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.pillarsChanged) {
                window.requestAnimationFrame(() => setPillars(gameState.pillars))
            }
        })
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