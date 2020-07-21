import React from "react"
import comp from "../images/composter.png"

const AreaDelete = ({ usernameChosen, numbersDeleteEvent }) => {

    const styleText = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "1rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        bottom: "6rem",
        left: "3.7rem",
        zIndex: "99999999999999999"
    }

    const styleImg = {
        zIndex: "999999999",
        position: "absolute",
        height: "2.5rem",
        bottom: "1rem",
        left: "2rem",
    }

    if (numbersDeleteEvent[0] > 0 && usernameChosen) {
        return (
            <>
                <img src={comp} style={styleImg} alt="composter" />
                <div style={styleText}> {numbersDeleteEvent[0]} / {numbersDeleteEvent[1]}</div>
            </>
        )
    }
    else return null 
}

export default AreaDelete