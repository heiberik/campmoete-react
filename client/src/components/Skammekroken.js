import React from "react"
import { useState, useEffect } from 'react'

const Skammekroken = ({ messagesService }) => {


    const [showSkammekroken, setShowSkammekroken] = useState(false)

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.freezeGameChanged) {
                if (gameState.freezeGame) {
                    setShowSkammekroken(gameState.freezeGame)
                }
                else {
                    setTimeout(() => {
                        setShowSkammekroken(gameState.freezeGame)
                    }, 3000)
                }
            }
        })
    }, [messagesService])

    const styleSkam = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        textFamily: "Arial",
        fontWeight: "bold",
        fontSize: "1.5rem",
        position: "absolute",
        bottom: "4.5rem",
        right: "0.5vw",
        height: "10rem",
        width: "10rem",
        background: "purple",
        color: "pink",
        border: "solid 2px pink",
        borderRadius: ".2rem",
    }

    if (!showSkammekroken) return null
    else return (
        <div style={styleSkam}>
            Krok of Skam
        </div>
    )
}



export default Skammekroken