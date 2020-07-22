import React from "react"
import comp from "../images/composter.png"

const AreaDelete = ({ numbersDeleteEvent }) => {

    const styleText = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "1rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        bottom: "5rem",
        left: "4.5vw",
        zIndex: "99999999999999999"
    }

    const styleImg = {
        position: "absolute",
        height: "2.5rem",
        bottom: "0.8rem",
        left: "3vw",
        zIndex: "99999999999999999"
    }

    if (numbersDeleteEvent[0] > 0) {
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