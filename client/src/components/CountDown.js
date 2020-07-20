import React from "react"

const CountDown = ({ countDown }) => {

    const countDownStyle = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "10rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "black",
        top: "20vh",
        left: "50vw",
        zIndex: "9999"
    }

    if (countDown > -1) {
        return (
            <div style={countDownStyle}> {countDown} </div>
        )
    }
    else return null
}

export default CountDown