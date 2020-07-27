import React from "react"
import "../css/WriteMessageBox.css"


const WriteMessageBox = React.memo(({
    messageText,
    sendMessageHandler,
    messageTextChangedhandler,
    usernameChosen,
    setUsernameHandler }) => {


    if (!usernameChosen) {
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
})

export default WriteMessageBox