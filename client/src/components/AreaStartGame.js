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
        zIndex: "99999999999999999",
        cursor: "default",
    }

    const coloredBall = {
        borderRadius: "1.5rem",
        border: "solid 1rem orange",
        color: "black",
        background: "orange",
        fontWeight: "bold",
        fontFamily: "Arial",
        zIndex: "99999999999999999",
        position: "absolute",
        bottom: ".9rem",
        right: "3vw",
        fontSize: "10px",
        padding: "0px",
        opacity: numbersGameEvent[0] / numbersGameEvent[1] + .2,
    }

    return <div style={coloredBall}> </div>
    
}

export default AreaStartGame