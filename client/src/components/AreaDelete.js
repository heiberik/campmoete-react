import React from "react"
import comp from "../images/composter.png"

const AreaDelete = ({ usernameChosen, numbersDeleteEvent }) => {

    const styleText = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "3rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "orange",
        top: "10vh",
        left: "40vw",
        zIndex: "50"
    }

    const styleImg = {
        zIndex: "999999999",
        position: "absolute",
        height: "3rem",
        bottom: ".8rem",
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
    else return (
        <>
            <img src={comp} style={styleImg} alt="composter" />
        </>
    )
}

export default AreaDelete