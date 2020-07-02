import React from "react"
import User from "./User"
import diamond from "../images/diamond.png"

const Users = ({ users }) => {

    const style = {
        position: "absolute",
        top: "65px",
        left: "0px",
        margin: "15px",
        overflow: "visible",
    }

    const styleList = {
        listStyleType: "none",
        marginTop: "5px",
    }

    const styleImg = {
        height: "20px",
        width: "20px",
    }

    if (users.length === 0){
        return null
    }
    else return (
        <div style={style}>
            <img style={styleImg} src={diamond} alt="diamond"></img>
            <ul style={styleList}>
                {users.map(user => <User key={user.id} user={user} />)}
            </ul>
        </div>

    )
}

export default Users