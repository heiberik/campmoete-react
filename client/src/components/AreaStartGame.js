import React from "react"
import pig from "../images/pig.png"

const AreaStartGame = ({ numbersGameEvent }) => {

    const styleText = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "1rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        bottom: "5rem",
        right: "2.8vw",
        zIndex: "99999999999999999"
    }

    const styleImg = {
        position: "absolute",
        height: "2.2rem",
        bottom: "1.2rem",
        right: "3vw",
        zIndex: "99999999999999999"
    }

    if (numbersGameEvent[0] > 0) {
        return (
            <>
                <img src={pig} style={styleImg} alt="composter" />
                <div style={styleText}> {numbersGameEvent[0]} / {numbersGameEvent[1]}</div>
            </>
        )
    }
    else return null 
}

export default AreaStartGame