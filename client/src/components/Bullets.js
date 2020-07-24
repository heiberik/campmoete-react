import React from "react"
import Bullet from "./Bullet"
import { useState, useEffect } from 'react'

const Bullets = ({ messagesService }) => {

    const [bullets, setBullets] = useState([])

    useEffect(() => {

        const bulletsList = []

        messagesService.getGameState((gameState) => {
            if (gameState.bulletsChanged) {
                bulletsList.push(gameState.bullets)
            }
        })

        const changeGameState = () => {
            const bullts = bulletsList.shift()
            if (bullts) {
                window.requestAnimationFrame(() => setBullets(bullts))
            }
        }

        setInterval(() => {
            changeGameState()
        }, 1000 / 60);

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