import React from "react"

const User = ({ user }) => {


    const style = {
        display: "flex",
        flexFirection: "row-reverse",
    }

    const styleUsername = {
        color: "white",
        fontSize: "16px",
        fontFamily: "Arial",
        margin: "0px",
        padding: "0px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
    }

    const styleBox = {
        width: "12px",
        height: "12px",
        borderRadius: "5px",
        background: user.color,
        margin: "auto",
        marginLeft: "5px",
    }

    return (
        <div style={style}>
            <div style={styleUsername}> {user.username} </div>
            <div style={styleBox}></div>
        </div>
    )
}

export default User