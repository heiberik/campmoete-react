import React from "react"

const AreaStartGame = ({ numbersGameEvent }) => {

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