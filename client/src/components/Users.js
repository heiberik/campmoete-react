import React from "react"
import { useState, useEffect } from 'react'
import User from "./User"

const Users = React.memo(({ users }) => {

    const [usersSorted, setUsersSorted] = useState([])

    useEffect(() => {
        if (users[0] && users[0].kills >= 0){
            setUsersSorted(users.sort((a, b) => {return b.kills - a.kills}))
        }
        else {
            setUsersSorted(users.sort((a, b) => a.username.localeCompare(b.username)))
        }
        
    }, [users])

    const style = {
        position: "absolute",
        top: "5vh",
        left: "0px",
        margin: "0 0 3px 0",
        marginLeft: "10px",
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
                    return <User key={user.socketID} user={user} latency={false} />
                })}
            </ul>
        </div>

    )
})

export default Users