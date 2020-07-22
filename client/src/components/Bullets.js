import React from "react"
import Bullet from "./Bullet"
import { useState, useEffect } from 'react'

const Bullets = ({ messagesService }) => {

    const [bullets, setBullets] = useState([])
    
    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.bulletsChanged) {
                setBullets(gameState.bullets)
            }
        })
    }, [messagesService])

    return (
        <ul>
            {bullets.map(b => {
                return (
                    <Bullet
                        bullet={b}
                        key={b.id} />
                )
            })}
        </ul>
    )
}

export default Bullets