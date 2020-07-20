import React from "react"
import { useState, useEffect } from 'react'

const Score = ({ highscore, currentscore, usernameChosen, }) => {

    const [newHighScore, setNewHighScore] = useState(false)
    const [highscoreCheck, setHighscoreCheck] = useState(0)

    useEffect(() => {
        setHighscoreCheck(hs => {
            if (highscore > hs) {
                setTimeout(() => setNewHighScore(false), 6000)
                setNewHighScore(true)
                return highscore
            }
            else return hs
        })
    }, [highscore])

    const scoreStyle = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: ".8rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        top: "6rem",
        left: "50vw",
        zIndex: "9999"
    }

    const newHighScoreStyle = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "3rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        top: "10rem",
        left: "50vw",
        zIndex: "9999"
    }

    if (!usernameChosen) return null
    else if (newHighScore) {
        return (
            <>
                <div style={newHighScoreStyle}> NEW HIGHSCORE!</div>
                <div style={scoreStyle}> Current Score: {currentscore} - High Score: {highscoreCheck}</div>
            </>
        )
    }
    else {
        return (
            <div style={scoreStyle}> Current Score: {currentscore} - High Score: {highscoreCheck}</div>
        )
    }
}

export default Score