import React from "react"
import { useState, useEffect } from 'react'
import User from "./User"

const Users = ({ users }) => {

    const [usersSorted, setUsersSorted] = useState([])

    useEffect(() => {
        setUsersSorted(usersS => {
            if (usersS.length === users.length){
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


    if (users.length === 0){
        return null
    }
    else return (
        <div style={style}>
            <ul style={styleList}>
                {usersSorted.map(user => <User key={user.id} user={user} />)}
            </ul>
        </div>

    )
}

export default Users