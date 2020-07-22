import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'
import Users from "./Users"
import { useState, useEffect } from 'react'


const Players = ({ messagesService, user }) => {

    const [users, setUsers] = useState([])

    useEffect(() => {

        const movequeue = []

        messagesService.getGameState((gameState) => {
            if (gameState.usersChanged) {
                movequeue.push(gameState.users)
                
            }
        })

        setInterval(() => {
            if (movequeue[0]){
                setUsers(movequeue.shift())
            }
        }, 1000 / 55)
    }, [messagesService])

    return (
        <>
            <Users users={users} />
            <ul>
                {users.map(u => {
                    if (u.id !== user.id) {
                        return (
                            <PlayerOther
                                key={u.id}
                                user={u} />
                        )
                    }
                    else {
                        return (
                            <PlayerClient
                                key={u.id}
                                user={u} />
                        )
                    }
                })}
            </ul>
        </>
    )
}



export default Players