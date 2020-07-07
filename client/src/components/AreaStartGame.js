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
        bottom: "10vh",
        left: "95vw",
        zIndex: "50"
    }

    const styleImg = {
        zIndex: "999999999",
        position: "absolute",
        height: "3rem",
        bottom: ".8rem",
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