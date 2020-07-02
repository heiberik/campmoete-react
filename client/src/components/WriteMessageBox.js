import React from "react"
import "../css/WriteMessageBox.css"


const WriteMessageBox = ({
    messageText,
    sendMessageHandler,
    messageTextChangedhandler,
    user,
    setUsernameHandler }) => {


    if (!user) {
        return (
            <form className="form" onSubmit={setUsernameHandler}>
                <input
                    className="form_input"
                    value={messageText}
                    onChange={messageTextChangedhandler}
                />
                <button
                    className="form_button"
                    type="submit">
                    User
            </button>
            </form>
        )
    }
    else return (
        <form className="form" onSubmit={sendMessageHandler}>
            <input
                className="form_input"
                value={messageText}
                onChange={messageTextChangedhandler}
            />
            <button
                className="form_button"
                type="submit">
                Send
            </button>
        </form>
    )
}

export default WriteMessageBox