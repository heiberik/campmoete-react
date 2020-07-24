import React from "react"
import campfire from "../images/campfire.gif"

const Campfire = ({ messages }) => {

    const style = {
        width: "7vw",
        position: "absolute",
        transform: "translateX(-50%)",
        top: "45vh",
        left: "50vw",
    }

    const check = messages.find(msg => msg.message === "Campmøte!")

    if (check){
        return (
            <img style={style} src={campfire} alt="campfire" />
        )
    }
    else return null
}

export default Campfire