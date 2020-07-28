import React from "react"

const User = React.memo(({ user }) => {

    const style = {
        display: "flex",
        flexFirection: "row-reverse",
        alignItems: "center",
        marginBottom: "2px",
    }

    const styleUsername = {
        color: "white",
        fontSize: "15px",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
    }

    const styleLatencyGreen = {
        color: "#2ade2a",
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
        margin: "auto",
        marginLeft: "5px",
    }

    const styleLatencyYellow = {
        color: "yellow",
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
        margin: "auto",
        marginLeft: "5px",
    }

    const styleLatencyRed = {
        color: "red",
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
        margin: "auto",
        marginLeft: "5px",
    }

    const styleBox = {
        width: "15px",
        height: "15px",
        borderRadius: "8px",
        background: user.color,
        marginRight: "8px",
    }

    if (user.latency < 100){
        return (
            <div style={style}>
                <div style={styleBox}></div>
                <div style={styleUsername}> {user.username} </div>
                <div style={styleLatencyGreen}> {user.latency} </div>
            </div>
        )
    }
    else if (user.latency >= 100 && user.latency < 200){
        return (
            <div style={style}>
                <div style={styleBox}></div>
                <div style={styleUsername}> {user.username} </div>
                <div style={styleLatencyYellow}> {user.latency} </div>
            </div>
        )
    }
    else return (
        <div style={style}>
            <div style={styleBox}></div>
            <div style={styleUsername}> {user.username} </div>
            <div style={styleLatencyRed}> {user.latency} </div>
        </div>
    )
    
})

export default User