import React from "react"
import { useState, useEffect } from 'react'

const DeadUsers = ({ messagesService }) => {

    const [deadUsers, setDeadUsers] = useState([])

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.usersDeadChanged) {
                setDeadUsers(gameState.deadUsers)
            }
        })
    }, [messagesService])

    /*
    const usersDeadStyle1 = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "3.5rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "red",
        top: "15rem",
        left: "50vw",
        zIndex: "9999",
        cursor: "default",
    }
 
    const usersDeadStyle2 = {
        textAlign: "center",
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "1rem",
        width: "100%",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "white",
        top: "20rem",
        left: "50vw",
        textShadow: "1px 1px black",
        zIndex: "9999",
        cursor: "default",
    }
    */

    if (deadUsers.length > 0) {
        return (
            <div>

            </div>
        )
    }
    else return null
}

export default DeadUsers