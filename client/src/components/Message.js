import React from "react"

const Message = ({ message }) => {

    const style = {
        position: "absolute",
        top: message.top + "%",
        left: message.left + "%",
        transform: "translateX(-50%)",
        zIndex: message.number,
        fontSize: "16px",
        padding: "15px",
        maxWidth: "200px",
        fontFamily: "Arial",
        borderRadius: "5px",
        background: message.color,
    }

    return (
        <li style={style}> {message.message} </li>
    )
}

export default Message