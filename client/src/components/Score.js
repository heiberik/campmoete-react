import React from "react"
import { useState, useEffect } from 'react'

const Score = ({ highscore, currentscore, usernameChosen }) => {

    const [newHighScore, setNewHighScore] = useState(false)
    const [highscoreCheck, setHighscoreCheck] = useState(-1)

    useEffect(() => {
        setHighscoreCheck(hs => {
            if (!usernameChosen) return -1
            else if (hs === -1){
                return highscore
            }
            else if (highscore > hs) {
                setTimeout(() => setNewHighScore(false), 6000)
                setNewHighScore(true)
                return highscore
            }
            else return hs
        })
    }, [highscore, usernameChosen])

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
                <div style={scoreStyle}> Current Score: {currentscore} &emsp;&emsp;&emsp;&emsp; Highest Score: {highscoreCheck}</div>
            </>
        )
    }
    else {
        return (
            <div style={scoreStyle}> Current Score: {currentscore} &emsp;&emsp;&emsp;&emsp; Highest Score: {highscoreCheck}</div>
        )
    }
}

export default Score