import React from "react"
import { useState, useEffect } from 'react'

const Skammekroken = React.memo(({ messagesService }) => {


    const [showSkammekroken, setShowSkammekroken] = useState(false)

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.idiotBoxChanged) {
                setShowSkammekroken(gameState.showIdiotBox)
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
        bottom: "10vh",
        right: "1vw",
        height: "15vh",
        width: "15vw",
        background: "purple",
        color: "pink",
        border: "solid 2px pink",
        borderRadius: ".2rem",
        zIndez: "999",
    }

    if (!showSkammekroken) return null
    else return (
        <div style={styleSkam}>
            Idiotboksen
        </div>
    )
})

export default Skammekroken