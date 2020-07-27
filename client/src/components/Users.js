import React from "react"
import { useState, useEffect } from 'react'
import User from "./User"

const Users = React.memo(({ users, userOriginal, messagesService }) => {

    const [usersSorted, setUsersSorted] = useState([])

    useEffect(() => {
        setUsersSorted(usersS => {
            if (usersS.length === users.length) {
                return usersS
            }
            else {
                return users.sort((a, b) => a.username.localeCompare(b.username))
            }
        })
    }, [users])

    const style = {
        position: "absolute",
        top: "6rem",
        left: "0px",
        marginLeft: "15px",
        overflow: "visible",
    }

    const styleList = {
        listStyleType: "none",
        marginTop: "5px",
    }


    if (users.length === 0) {
        return null
    }
    else return (
        <div style={style}>
            <ul style={styleList}>
                {usersSorted.map(user => {
                    if (userOriginal.socketID === user.socketID) {
                        return <User messagesService={messagesService} key={user.socketID} user={user} latency={true} />
                    }
                    else return <User key={user.socketID} user={user} latency={false} />
                })}
            </ul>
        </div>

    )
})

export default Users