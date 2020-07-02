import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'


const Players = ({ users, user, shield }) => {

    return (
        <>
            <ul>
                {users.map(u => {
                    if (u.id !== user.id) {
                        return (
                            <PlayerOther
                                key={u.id}
                                user={u} />
                        )
                    }
                })}
            </ul>
            <PlayerClient
                user={user}
                shield={shield} />
        </>
    )
}



export default Players