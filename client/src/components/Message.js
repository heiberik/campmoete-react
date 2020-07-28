import React from "react"

const Message = React.memo(({ message }) => {

    const style = {
        position: "absolute",
        top: message.posY + "vh",
        left: message.posX + "vw",
        zIndex: message.number,
        width: message.width + "vw",
        maxWidth: message.width + "vw",
        height: message.height + "vh",
        maxHeight: message.height + "vh",
        fontSize: message.fontSize + "px",
        overflowWrap: "break-word",
        overflow: "hidden",
        fontFamily: "Arial",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        borderWidth: "0px",
        background: message.color,
        color: message.colorText,
        cursor: "default",
        padding: "1vw",
        WebkitBoxSizing: "border-box",
        mozBoxSizing: "border-box",
        boxSizing: "border-box",
    }

    return (
        <li style={style}> {message.message} </li>
    )
})

export default Message