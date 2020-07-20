import React from "react"
import User from "./User"

const Users = ({ users }) => {

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
                {users.map(user => <User key={user.id} user={user} />)}
            </ul>
        </div>

    )
}

export default Users