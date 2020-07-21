import React from "react"

const Message = ({ message }) => {

    const style = {
        position: "absolute",
        top: message.top + "vh",
        left: message.left + "vw",
        zIndex: message.number,
        padding: "1vh",
        width: "10vw",
        height: "4vh",
        fontSize: "15px",
        overflowWrap: "break-word",
        overflow: "hidden",
        fontFamily: "Arial",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        borderWidth: "0px",
        background: message.color,
    }

    return (
        <li style={style}> {message.message} </li>
    )
}

export default Message