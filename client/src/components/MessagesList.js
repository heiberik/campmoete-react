import React from "react"
import Message from './Message'

const MessagesList = ({ list }) => {

    const style = {
        listStyleType: "none",
        margin: "0px",
        padding: "0px",
    }

    return (
        <ul style={style}>
            {list.map(msg => <Message key={msg.number} message={msg} />)}
        </ul>
    )
}

export default MessagesList