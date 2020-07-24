import React from "react"

const Message = React.memo(({ message }) => {

    const x = Math.round((message.left + Number.EPSILON) * 100) / 100
    const y = Math.round((message.top + Number.EPSILON) * 100) / 100

    const style = {
        position: "absolute",
        top: y + "vh",
        left: x + "vw",
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
        cursor: "default",
    }

    return (
        <li style={style}> {message.message} </li>
    )
})

export default Message