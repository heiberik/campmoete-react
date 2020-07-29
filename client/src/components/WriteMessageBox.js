import React from "react"
import { useRef, useEffect } from 'react'
import "../css/WriteMessageBox.css"


const WriteMessageBox = React.memo(({
    messageText,
    sendMessageHandler,
    messageTextChangedhandler,
    usernameChosen,
    setUsernameHandler }) => {

    const box = useRef(null)

    useEffect(() => {
        if (usernameChosen) {

            box.current.style.visibility = "hidden"
            document.getElementsByClassName("form_input")[0].blur();
            document.getElementsByClassName("form")[0].style.bottom = "0"

            let hidden = true
            const keyDownHandler = (e) => {
                if (e.target.tagName.toUpperCase() === "INPUT") {
                    
                }
                else if (e.keyCode === 84) {
                    if (hidden) {
                        e.preventDefault()
                        box.current.style.visibility = "visible"
                        document.getElementsByClassName("form_input")[0].focus();
                        hidden = false
                    }
                    else {
                        box.current.style.visibility = "hidden"
                        hidden = true
                    }
                }
            }

            const mouseClickHandler = (e) => {
                if (e.target.tagName.toUpperCase() !== "INPUT") {
                    box.current.style.visibility = "hidden"
                    hidden = true   
                }
            }

            document.addEventListener('keydown', keyDownHandler, true)
            document.addEventListener('mousedown', mouseClickHandler, true)
        }
    }, [usernameChosen])



    if (!usernameChosen) {
        return (
            <form className="form" onSubmit={setUsernameHandler}>
                <input
                    className="form_input"
                    value={messageText}
                    onChange={messageTextChangedhandler}
                />
            </form>
        )
    }
    else return (
        <form ref={b => box.current = b} className="form" onSubmit={sendMessageHandler}>
            <input
                className="form_input"
                value={messageText}
                onChange={messageTextChangedhandler}
            />
        </form>
    )
})

export default WriteMessageBox