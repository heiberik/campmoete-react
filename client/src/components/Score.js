import React from "react"
import { useState, useEffect } from 'react'

import "../css/Anims.css"

const Score = React.memo(({ messagesService }) => {

    const [newHighScore, setNewHighScore] = useState(false)
    const [scoreCurrentHigh, setScoreCurrentHigh] = useState([0, 0, ""])
    const [pillarGameInProgress, setPillarGameInProgress] = useState(false)
    const [gunGameInProgress, setGunGameInProgress] = useState(false)
    const [timer, setTimer] = useState(-1)
    const [gunGameScore, setGunGameScore] = useState([0, 0])
    const [newKill, setNewKill] = useState("")
    const [teamWon, setTeamWon] = useState("")
    const [showScorePillar, setShowScorePillar] = useState(false)

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.scoreChanged) {
                setScoreCurrentHigh([gameState.currentScore, gameState.highScore, gameState.highScoreUsername])
                if (gameState.newHighscore) {
                    setNewHighScore(true)
                    setTimeout(() => {
                        setNewHighScore(false)
                    }, 3000)
                }
            }

            if (gameState.gameInProgressChanged) {
                setTimeout(() => {
                    setPillarGameInProgress(gameState.gameInProgress)
                    setGunGameInProgress(gameState.gunGameInProgress)
                }, 1000)
            }

            if (gameState.freezeGameChanged) {
                if (gameState.freezeGame)
                    setShowScorePillar(true)
                setTimeout(() => {
                    setShowScorePillar(false)
                }, 3000)
            }

            if (gameState.timerChanged) {
                setTimer(gameState.timer)
            }

            if (gameState.teamWonChanged) {
                setTeamWon(gameState.teamWon)
                setTimeout(() => {
                    setTeamWon("")
                }, 4000)
            }

            if (gameState.gunScoreChanged) {
                setGunGameScore(score => {
                    if (score[0] < gameState.scoreRed) {
                        setNewKill("red")
                        setTimeout(() => {
                            setNewKill("")
                        }, 1000)
                    }
                    else if (score[1] < gameState.scoreBlue) {
                        setNewKill("blue")
                        setTimeout(() => {
                            setNewKill("")
                        }, 1000)
                    }
                    return [gameState.scoreRed, gameState.scoreBlue]
                })
            }

        })
    }, [messagesService])


    const scoreStyle = {
        display: "flex",
        flexFirection: "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "10px",
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
        fontSize: "4rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "red",
        top: "30vh",
        left: "50vw",
        zIndex: "9999"
    }

    const newScoreStyle = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "5rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        top: "30vh",
        left: "50vw",
        zIndex: "9999"
    }

    const redStyle = {
        color: "red"
    }

    const blueStyle = {
        color: "blue"
    }

    const blueKill = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "10vw",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "blue",
        top: "30vh",
        left: "50vw",
        zIndex: "9999"
    }

    const redKill = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "10vw",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "red",
        top: "30vh",
        left: "50vw",
        zIndex: "9999"
    }

    const draw = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "10vw",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        top: "30vh",
        left: "50vw",
        zIndex: "9999"
    }

    if (newHighScore) {
        return (
            <>
                <div style={newHighScoreStyle}> NEW HIGHSCORE {scoreCurrentHigh[1]}</div>
                <div style={scoreStyle}> Current Score: {scoreCurrentHigh[0]} &emsp;&emsp;&emsp;&emsp; Highest Score: {scoreCurrentHigh[1]}</div>
            </>
        )
    }
    else if (teamWon !== "") {
        if (teamWon === "Red") return (
            <>
                <div style={redKill}> RED TEAM WON </div>
                <div style={scoreStyle}> &emsp;  </div>
            </>
        )
        if (teamWon === "Blue") return (
            <>
                <div style={blueKill}> BLUE TEAM WON </div>
                <div style={scoreStyle}> &emsp;  </div>
            </>
        )
        if (teamWon === "Draw") return (
            <>
                <div style={draw}> DRAW </div>
                <div style={scoreStyle}> &emsp;  </div>
            </>
        )
    }
    else if (pillarGameInProgress && showScorePillar) {
        return (
            <>
                <div style={scoreStyle}> Current Score: {scoreCurrentHigh[0]} &emsp;&emsp;&emsp;&emsp; Highest Score: {scoreCurrentHigh[1]}</div>
                <div style={newScoreStyle}> {scoreCurrentHigh[0]} </div>
            </>
        )
    }
    else if (pillarGameInProgress) {
        return (
            <div style={scoreStyle}> Current Score: {scoreCurrentHigh[0]} &emsp;&emsp;&emsp;&emsp; Highest Score: {scoreCurrentHigh[1]}</div>
        )
    }
    else if (gunGameInProgress && newKill === "red") {
        return (
            <>
                <div style={scoreStyle}>
                    <p style={redStyle} >Red Team {gunGameScore[0]}</p>
            &emsp;&emsp;{timer}&emsp;&emsp;
                <p style={blueStyle}>{gunGameScore[1]} Blue Team</p>
                </div>
                <div style={redKill}> +1 </div>
            </>
        )
    }
    else if (gunGameInProgress && newKill === "blue") {
        return (
            <>
                <div style={scoreStyle}>
                    <p style={redStyle} >Red Team {gunGameScore[0]}</p>
            &emsp;&emsp;{timer}&emsp;&emsp;
                <p style={blueStyle}>{gunGameScore[1]} Blue Team</p>
                </div>
                <div style={blueKill}> +1 </div>
            </>
        )
    }
    else if (gunGameInProgress) {
        return (
            <div style={scoreStyle}>
                <p style={redStyle} >Red Team {gunGameScore[0]}</p>
            &emsp;&emsp;{timer}&emsp;&emsp;
                <p style={blueStyle}>{gunGameScore[1]} Blue Team</p>
            </div>
        )
    }
    else if (scoreCurrentHigh[2] !== "") {
        return (
            <div style={scoreStyle}> Highest Score in Pillar Game: {scoreCurrentHigh[1]} by {scoreCurrentHigh[2]}</div>
        )
    }

    else return (
        <div style={scoreStyle}> &emsp;  </div>
    )
})

export default Score