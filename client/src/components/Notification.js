import React from "react"

const Notification = ({ message, messageHandler }) => {

    const style = {
        position: "absolute",
        background: "orange",
        border: "solid black 2px",
        borderRadius: "10px",
        top: "10%",
        left: "50%",
        color: "black",
        fontSize: "18px",
        fontFamily: "Arial",
        fontWeight: "bold",
        padding: "30px",
        transform: "translateX(-50%)",
        cursor: "default",
    }

    if (message !== ""){
        setTimeout(() => {
            messageHandler("")
        }, 4000)

        return (
            <div style={style}>
                <p> {message} </p>
            </div>
        )
    }
    else return null 
}

export default Notification