import React from "react"
import Bullet from "./Bullet"
import { useState, useEffect } from 'react'

const Bullets = React.memo(({ messagesService }) => {

    const [bullets, setBullets] = useState([])

    useEffect(() => {

        let bulletsList = []

        messagesService.getGameState((gameState) => {
            if (gameState.bulletsChanged) {
                bulletsList.push(gameState.bullets)
            }
        })

        const changeGameState = () => {
            const bullts = bulletsList.shift()
            if (bulletsList.length > 60) {
                const bulletsLast = bulletsList[bulletsList.length - 1]
                bulletsList = []
                window.requestAnimationFrame(() => setBullets(bulletsLast))
            }
            else if (bullts) {
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
})

export default Bullets