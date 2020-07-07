import React from "react"
import AreaDelete from "./AreaDelete"
import AreaStartGame from "./AreaStartGame"

const Areas = ({
    usernameChosen,
    numbersDeleteEvent,
    numbersGameEvent,
    countDown,
    usersDead,
    highscore,
    newHighscore,
    currentscore }) => {

    const countDownStyle = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "10rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "black",
        top: "20vh",
        left: "50vw",
        zIndex: "9999"
    }

    const usersDeadStyle1 = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "2rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "red",
        top: "20vh",
        left: "50vw",
        zIndex: "9999"
    }

    const usersDeadStyle2 = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "1.8rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "black",
        top: "25vh",
        left: "50vw",
        zIndex: "9999"
    }

    const highScore = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: ".8rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        top: "10vh",
        left: "50vw",
        zIndex: "9999"
    }

    if (!usernameChosen) return null

    if (newHighscore) {
        return (
            <div>
                <div style={usersDeadStyle1}> {highscore} is a new High Score!</div>
                <div style={usersDeadStyle2}> idiot: {usersDead} </div>

                <AreaDelete
                    numbersDeleteEvent={numbersDeleteEvent}
                    usernameChosen={usernameChosen} />
                <AreaStartGame
                    usernameChosen={usernameChosen}
                    numbersGameEvent={numbersGameEvent} />
            </div>
        )
    }

    if (usersDead.length > 0) {
        return (
            <div>
                <div style={usersDeadStyle1}> Game Over </div>
                <div style={usersDeadStyle2}> idiot: {usersDead} </div>

                <AreaDelete
                    numbersDeleteEvent={numbersDeleteEvent}
                    usernameChosen={usernameChosen} />
                <AreaStartGame
                    usernameChosen={usernameChosen}
                    numbersGameEvent={numbersGameEvent} />
            </div>
        )
    }
    if (countDown > -1) {
        return (
            <div>
                <div style={countDownStyle}> {countDown} </div>
                <AreaDelete
                    numbersDeleteEvent={numbersDeleteEvent}
                    usernameChosen={usernameChosen} />
                <AreaStartGame
                    usernameChosen={usernameChosen}
                    numbersGameEvent={numbersGameEvent} />
            </div>
        )
    }
    else return (
        <div>
            <div style={highScore}> Current score: {currentscore} - High score: {highscore}</div>
            <AreaDelete
                numbersDeleteEvent={numbersDeleteEvent}
                usernameChosen={usernameChosen} />
            <AreaStartGame
                usernameChosen={usernameChosen}
                numbersGameEvent={numbersGameEvent} />
        </div>
    )
}

export default Areas