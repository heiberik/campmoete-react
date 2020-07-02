import React from "react"
import { useState, useEffect } from 'react'
import comp from "../images/composter.png"

const AreaDelete = ({ users, user, msgService }) => {

    const [eventStarted, setEventStarted] = useState(false)
    const [showNumbers, setShowNumbers] = useState(false)
    const [numberReady, setNumberReady] = useState(0)

    useEffect(() => {
        msgService.numbersDeleteEvent((data) => {
            setNumberReady(data.number)
            if (data.number > 0) setShowNumbers(true)
            else setShowNumbers(false)
        })

        msgService.beginDeleteEvent((data) => {
            setNumberReady(data.number)
            msgService.completeDeleteEvent()
            setShowNumbers(false)
        })

    }, [msgService])

    useEffect(() => {
        if (user.playerPosX < 8 && user.playerPosY > 88 && user.playerPosX > 0 && user.playerPosY < 100) {
            if (!eventStarted) {
                setEventStarted(true)
                msgService.startDeleteEvent(true)
            }
        }
        else {
            if (eventStarted) {
                setEventStarted(false)
                msgService.startDeleteEvent(false)
            }
        }
    }, [user, eventStarted, msgService])


    const styleText = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "3rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "orange",
        top: "10vh",
        left: "50vw",
        zIndex: "50"
    }

    const styleImg = {
        zIndex: "999999999",
        position: "absolute",
        height: "3rem",
        bottom: ".8rem",
        left: "2rem",
    }

    if (showNumbers && user) {
        return (
            <>
                <img src={comp} style={styleImg} alt="composter" />
                <div style={styleText}> {numberReady} / {users.length}</div>
            </>
        )
    }
    else return (
        <>
            <img src={comp} style={styleImg} alt="composter" />
        </>
    )
}

export default AreaDelete