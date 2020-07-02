import React from "react"
import Message from './Message'
import Users from "./Users"

const MessagesList = ({ list, users }) => {

    const style = {
        listStyleType: "none",
        margin: "0px",
        padding: "0px",
        flexGrow: "1",
        background: "radial-gradient(#e66465, #9198e5)"
    }

    return (
        <>
            <Users users={users} />
            <ul style={style}>
                {list.map(msg => <Message key={msg.number} message={msg} />)}
            </ul>
        </>

    )
}

export default MessagesList