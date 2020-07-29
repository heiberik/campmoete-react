import React from "react"
import { useRef, useEffect } from 'react'


const ChatBox = React.memo(({ messages }) => {

    const box = useRef(null)
    const rolf = useRef(null)

    useEffect(() => {

        box.current.style.visibility = "hidden"
        rolf.current.style.visibility = "hidden"

        let hidden = true
        const keyDownHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") {
                if (e.keyCode === 13) {
                    hidden = true
                }
            }
            else if (e.keyCode === 84) {
                if (!box.current) return 
                if (hidden) {
                    e.preventDefault()
                    box.current.style.visibility = "visible"
                    rolf.current.style.visibility = "visible"
                    hidden = false
                }
                else {
                    box.current.style.visibility = "hidden"
                    rolf.current.style.visibility = "hidden"
                    hidden = true
                }
            }
        }

        const mouseClickHandler = (e) => {
            if (e.target.tagName.toUpperCase() !== "INPUT") {
                if (!box.current) return 
                box.current.style.visibility = "hidden"
                rolf.current.style.visibility = "hidden"
                hidden = true
            }
        }

        document.addEventListener('keydown', keyDownHandler, true)
        document.addEventListener('mousedown', mouseClickHandler, true)
    }, [])

    const style = {
        listStyleType: "none",
        margin: "0px",
        padding: "1vw",
        height: "25vh",
        width: "30vw",
        position: "absolute",
        borderRadius: ".4vw",
        bottom: "4rem",
        left: "34vw",
        background: "rgba(82, 6, 82, 0.3)",
        overflow: "scroll",
        visibility: "hidden",
    }

    const msgStyle = {
        fontSize: "16px",
        marginBottom: "2px",
        color: "white",
    }

    const cRolf = {
        position: "absolute",
        bottom: "4.4rem",
        left: "62.5vw",
        zIndez: "99",
        visibility: "hidden",
        fontSize: "12px",
        color: "rgba(255, 255, 255, 0.3)",
    }


    return (
        <>
            <ul style={style} ref={b => box.current = b} className="chatBox">
                {messages.sort((a, b) => { return b.number - a.number }).map(msg =>
                    <p key={msg.number} style={msgStyle}>
                        <span style={{color: msg.userColor}}>{msg.username}:</span> {msg.message}
                    </p>
                )}
            </ul>
            <div style={cRolf} ref={b => rolf.current = b}> &copy; Rolf </div>
        </>
    )
})

export default ChatBox