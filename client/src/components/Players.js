import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'
import Users from "./Users"
import { useState, useEffect } from 'react'


const Players = ({ messagesService, userOriginal }) => {

    const [users, setUsers] = useState([])
    const [user, setUser] = useState(userOriginal)

    useEffect(() => {
        messagesService.getGameState((gameState) => {
            if (gameState.usersChanged) {
                setUsers(gameState.users)
            }
        })

        const handleUserInput = () => {

            const pm = {
                up: false,
                down: false,
                left: false,
                right: false,
                space: false,
                shoot: null,
            }

            const keyDownHandler = (e) => {
                if (e.target.tagName.toUpperCase() === "INPUT") return
                if (e.keyCode === 68 || e.keyCode === 38) pm.right = true
                else if (e.keyCode === 65 || e.keyCode === 37) pm.left = true
                else if (e.keyCode === 87 || e.keyCode === 39) pm.up = true
                else if (e.keyCode === 83 || e.keyCode === 40) pm.down = true
                else if (e.keyCode === 32) pm.space = true
            }

            let setFalse = false
            const keyUpHandler = (e) => {
                if (e.target.tagName.toUpperCase() === "INPUT") return
                if (e.keyCode === 68 || e.keyCode === 38) pm.right = false
                else if (e.keyCode === 65 || e.keyCode === 37) pm.left = false
                else if (e.keyCode === 87 || e.keyCode === 39) pm.up = false
                else if (e.keyCode === 83 || e.keyCode === 40) pm.down = false
                else if (e.keyCode === 32) pm.space = false
                setFalse = true
            }

            const mouseClickHandler = (e) => {
                if (e.target.tagName.toUpperCase() === "INPUT") return
                const x = (e.clientX / window.innerWidth) * 100
                const y = (e.clientY / window.innerHeight) * 100
                pm.shoot = [x, y]
            }

            document.addEventListener('keydown', keyDownHandler, false)
            document.addEventListener('keyup', keyUpHandler, false)
            document.addEventListener('click', mouseClickHandler, false)

            const moveSpeed1 = .5
            const moveSpeed2 = .25

            const loop = () => {
                if (pm.up || pm.down || pm.left || pm.right || pm.space || setFalse || pm.shoot) {
                    messagesService.sendPlayerMovement(pm)
                    pm.shoot = null
                    setFalse = false
                }
            }
            setInterval(() => {
                window.requestAnimationFrame(loop)
            }, 1000 / 60);
        }

        handleUserInput()

    }, [messagesService])


    return (
        <>
            <Users users={users} />
            <ul>
                {users.map(u => {
                    if (u.id !== user.id) {
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