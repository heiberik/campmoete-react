import React from "react"
import { useState, useEffect } from 'react'

const DeadUsers = React.memo(({ messagesService }) => {

    const [deadUsers, setDeadUsers] = useState([])

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.usersDeadChanged) {
                setDeadUsers(gameState.deadUsers)
            }
        })
    }, [messagesService])

    
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
 

    if (deadUsers.length > 0) {
        return (
            <div style={usersDeadStyle1}>
                {deadUsers}
            </div>
        )
    }
    else return null
})

export default DeadUsers