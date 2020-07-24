import React from "react"
import { useState, useEffect } from 'react'

const Score = ({ messagesService }) => {

    const [newHighScore, setNewHighScore] = useState(false)
    const [scoreCurrentHigh, setScoreCurrentHigh] = useState([0, 0])
    const [pillarGameInProgress, setPillarGameInProgress] = useState(false)

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.scoreChanged) {
                setScoreCurrentHigh([gameState.currentScore, gameState.highScore])
                if (gameState.newHighscore){
                    setNewHighScore(true)
                    setTimeout(() => {
                        setNewHighScore(false)  
                    }, 3000)
                }
            }

            if (gameState.gameInProgress){
                setPillarGameInProgress(true)
            }
            else setPillarGameInProgress(false)
        })
    }, [messagesService])


    const scoreStyle = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: ".6rem",
        width: "100%",
        background: "purple",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        top: "4rem",
        left: "50vw",
        zIndex: "9999",
        padding: ".3rem"
    }

    const newHighScoreStyle = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "3rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "red",
        top: "10rem",
        left: "50vw",
        zIndex: "9999"
    }

    if (newHighScore) {
        return (
            <>
                <div style={newHighScoreStyle}> NEW HIGHSCORE!</div>
                <div style={scoreStyle}> Current Score: {scoreCurrentHigh[0]} &emsp;&emsp;&emsp;&emsp; Highest Score: {scoreCurrentHigh[1]}</div>
            </>
        )
    }
    else if (pillarGameInProgress) {
        return (
            <div style={scoreStyle}> Current Score: {scoreCurrentHigh[0]} &emsp;&emsp;&emsp;&emsp; Highest Score: {scoreCurrentHigh[1]}</div>
        )
    }
    else return <div style={scoreStyle}> &emsp; </div>
}

export default Score