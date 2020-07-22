import React from "react"
import pig from "../images/pig2.png"

const AreaStartGunGame = ({ numbersGunGameEvent }) => {

    const styleText = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "1rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        bottom: "5rem",
        right: "14.5vw",
        zIndex: "99999999999999999"
    }

    const styleImg = {
        position: "absolute",
        height: "2.2rem",
        bottom: "1.2rem",
        right: "15vw",
        zIndex: "99999999999999999"
    }

    if (numbersGunGameEvent[0] > 0) {
        return (
            <>
                <img src={pig} style={styleImg} alt="composter" />
                <div style={styleText}> {numbersGunGameEvent[0]} / {numbersGunGameEvent[1]}</div>
            </>
        )
    }
    else return null 
}

export default AreaStartGunGame