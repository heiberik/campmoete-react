import React from "react"

const Notification = React.memo(({ message, messageHandler }) => {

    const style = {
        position: "absolute",
        background: "rgba(255, 255, 255, 0.05)",
        border: "solid black 2px",
        borderRadius: "10px",
        top: "10%",
        left: "50%",
        color: "black",
        fontSize: "16px",
        fontFamily: "Arial",
        fontWeight: "bold",
        padding: "30px",
        transform: "translateX(-50%)",
        cursor: "default",
    }

    if (message !== ""){
        setTimeout(() => {
            messageHandler("")
        }, 3000)

        return (
            <div style={style}>
                <p> {message} </p>
            </div>
        )
    }
    else return null 
})

export default Notification