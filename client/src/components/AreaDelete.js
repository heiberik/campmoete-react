import React from "react"

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
        zIndex: "99999999999999999",
        cursor: "default",
    }

    const coloredBall = {
        borderRadius: "1.5rem",
        border: "solid 1rem yellow",
        color: "black",
        background: "yellow",
        fontWeight: "bold",
        fontFamily: "Arial",
        zIndex: "99999999999999999",
        position: "absolute",
        bottom: ".9rem",
        left: "3vw",
        fontSize: "10px",
        padding: "0px",
        opacity: numbersDeleteEvent[0] / numbersDeleteEvent[1] + .2,
    }

    return <div style={coloredBall}> </div>
}

export default AreaDelete