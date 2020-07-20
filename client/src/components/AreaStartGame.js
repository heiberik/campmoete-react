import React from "react"
import pig from "../images/pig.png"

const AreaStartGame = ({ usernameChosen, numbersGameEvent }) => {

    const styleText = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "1rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        bottom: "6rem",
        right: "1.7rem",
        zIndex: "99999999999999999"
    }

    const styleImg = {
        zIndex: "999999999",
        position: "absolute",
        height: "2.2rem",
        bottom: "1.2rem",
        right: "2rem",
    }

    if (numbersGameEvent[0] > 0 && usernameChosen) {
        return (
            <>
                <img src={pig} style={styleImg} alt="composter" />
                <div style={styleText}> {numbersGameEvent[0]} / {numbersGameEvent[1]}</div>
            </>
        )
    }
    else return (
        <>
            <img src={pig} style={styleImg} alt="composter" />
        </>
    )

}

export default AreaStartGame