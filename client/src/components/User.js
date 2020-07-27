import React from "react"
import { useState, useEffect } from 'react'

const User = ({ user, latency, messagesService }) => {

    const [latencyVisual, setLatencyVisual] = useState(0)

    useEffect(() => {
        if (latency){
            messagesService.getPongServer((time) => {
                setLatencyVisual(time)
            })
            setInterval(() => {
                messagesService.pingServer()
            }, 2000)
        }
    }, [latency, messagesService])

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

    const styleLatency = {
        color: "yellow",
        fontSize: "10px",
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

    if (latency){
        return (
            <div style={style}>
                <div style={styleBox}></div>
                <div style={styleUsername}> {user.username} </div>
                <div style={styleLatency}> {latencyVisual} </div>
            </div>
        ) 
    }
    else return (
        <div style={style}>
            <div style={styleBox}></div>
            <div style={styleUsername}> {user.username} </div>
        </div>
    )
}

export default User