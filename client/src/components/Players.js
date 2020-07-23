import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'
import Users from "./Users"
import { useState, useEffect } from 'react'

const Players = ({ messagesService, userOriginal }) => {

    const [users, setUsers] = useState([])

    useEffect(() => {

        let usersServer = []

        const pm = {
            id: userOriginal.id,
            up: false,
            down: false,
            left: false,
            right: false,
            space: false,
            shoot: null,
            updateSeq: 0,
        }
        let setFalse = false

        messagesService.getGameState((gameState) => {
            if (gameState.usersChanged) {
                usersServer = gameState.users
            }
        })

        const keyDownHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") return
            if (e.keyCode === 68 || e.keyCode === 39) pm.right = true
            else if (e.keyCode === 65 || e.keyCode === 37) pm.left = true
            else if (e.keyCode === 87 || e.keyCode === 38) pm.up = true
            else if (e.keyCode === 83 || e.keyCode === 40) pm.down = true
            else if (e.keyCode === 32) pm.space = true
        }

        const keyUpHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") return
            if (e.keyCode === 68 || e.keyCode === 39) pm.right = false
            else if (e.keyCode === 65 || e.keyCode === 37) pm.left = false
            else if (e.keyCode === 87 || e.keyCode === 38) pm.up = false
            else if (e.keyCode === 83 || e.keyCode === 40) pm.down = false
            else if (e.keyCode === 32) pm.space = false
            setFalse = true
        }

        const mouseClickHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") {
                pm.up = false
                pm.left = false
                pm.right = false
                pm.down = false
                pm.space = false
                pm.shoot = null
                setFalse = true
                return
            }
            if (e.target.tagName.toUpperCase() === "BUTTON") return
            const x = (e.clientX / window.innerWidth) * 100
            const y = (e.clientY / window.innerHeight) * 100
            pm.shoot = [x, y]
        }

        const mouseUpHandler = (e) => {
            pm.shoot = null
            setFalse = true
        }

        const mouseOverHandler = (e) => {
            if (!pm.shoot) return
            const x = (e.clientX / window.innerWidth) * 100
            const y = (e.clientY / window.innerHeight) * 100
            pm.shoot = [x, y]
        }

        const blurHandler = (e) => {
            pm.up = false
            pm.left = false
            pm.right = false
            pm.down = false
            pm.space = false
            pm.shoot = null
            setFalse = true
        }

        document.addEventListener('keydown', keyDownHandler, false)
        document.addEventListener('keyup', keyUpHandler, false)
        document.addEventListener('mousedown', mouseClickHandler, false)
        document.addEventListener('mouseup', mouseUpHandler, false)
        document.addEventListener('mousemove', mouseOverHandler, false)
        window.addEventListener('blur', blurHandler, false)


        const sendMovementToServer = () => {
            if (pm.up || pm.down || pm.left || pm.right || pm.space || setFalse || pm.shoot) {
                messagesService.sendPlayerMovement(pm)
                setFalse = false
            }
        }

        setInterval(() => {
            sendMovementToServer()
            setUsers(usersServer)
        }, 1000 / 60);

    }, [messagesService, userOriginal])


    return (
        <>
            <Users users={users} />
            <ul>
                {users.map(u => {
                    if (u.id !== userOriginal.id) {
                        return (
                            <PlayerOther
                                key={u.id}
                                user={u} />
                        )
                    }
                    else {
                        return (
                            <PlayerClient
                                key={u.id}
                                user={u} />
                        )
                    }
                })}
            </ul>
        </>
    )
}



export default Players