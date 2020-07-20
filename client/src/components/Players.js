import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'
import Users from "./Users"


const Players = ({ users, user }) => {

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