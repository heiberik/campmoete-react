import React from "react"
import { useState, useEffect } from 'react'

const Score = ({ score, usernameChosen }) => {

    const [newHighScore, setNewHighScore] = useState(false)
    const [highscoreCheck, setHighscoreCheck] = useState(-1)

    useEffect(() => {
        setHighscoreCheck(hs => {
            if (!usernameChosen) return -1
            else if (usernameChosen && score[1] === 0) return 0
            else if (usernameChosen && score[1] > 0 && hs === 0) return score[1]
            else {
                setTimeout(() => setNewHighScore(false), 2000)
                setNewHighScore(true)
                return score[1]
            }
        })
    }, [score, usernameChosen])

    const scoreStyle = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: ".7rem",
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
                <div style={scoreStyle}> Current Score: {score[0]} &emsp;&emsp;&emsp;&emsp; Highest Score: {score[1]}</div>
            </>
        )
    }
    else {
        return (
            <div style={scoreStyle}> Current Score: {score[0]} &emsp;&emsp;&emsp;&emsp; Highest Score: {score[1]}</div>
        )
    }
}

export default Score