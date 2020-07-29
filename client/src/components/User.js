import React from "react"

const User = React.memo(({ user }) => {

    const style = {
        display: "flex",
        flexFirection: "row-reverse",
        alignItems: "center",
        marginBottom: "5px",
    }

    const styleUsername = {
        color: "white",
        fontSize: "15px",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
    }

    const styleScore = {
        color: "white",
        fontSize: "13px",
        fontWeight: "bold",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
        marginRight: "8px",
        marginLeft: "-28px",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        width: "21px",
        marginTop: "1px",
    }

    const styleLatencyGreen = {
        color: "#2ade2a",
        fontSize: "10px",
        fontWeight: "bold",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
        margin: "auto",
        marginLeft: "8px",
    }

    const styleLatencyYellow = {
        color: "yellow",
        fontSize: "10px",
        fontWeight: "bold",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
        margin: "auto",
        marginLeft: "8px",
    }

    const styleLatencyRed = {
        color: "red",
        fontSize: "10px",
        fontWeight: "bold",
        fontFamily: "Arial",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
        margin: "auto",
        marginLeft: "8px",
    }

    const styleBox = {
        width: "20px",
        height: "20px",
        borderRadius: "10px",
        background: user.color,
        marginRight: "8px",
    }

    if (user.kills >= 0){
        if (user.latency < 100){
            return (
                <div style={style}>
                    <div style={styleBox}></div>
                    <div style={styleScore}> {user.kills} </div>
                    <div style={styleUsername}> {user.username} </div>
                    <div style={styleLatencyGreen}> {user.latency} </div>
                </div>
            )
        }
        else if (user.latency >= 100 && user.latency < 200){
            return (
                <div style={style}>
                    <div style={styleBox}></div>
                    <div style={styleScore}> {user.kills} </div>
                    <div style={styleUsername}> {user.username} </div>
                    <div style={styleLatencyYellow}> {user.latency} </div>
                </div>
            )
        }
        else return (
            <div style={style}>
                <div style={styleBox}></div>
                <div style={styleScore}> {user.kills} </div>
                <div style={styleUsername}> {user.username} </div>
                <div style={styleLatencyRed}> {user.latency} </div>
            </div>
        )
    }
    else {
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
    }

    
    
})

export default User