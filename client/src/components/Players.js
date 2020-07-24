import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'
import Users from "./Users"
import { useState, useEffect } from 'react'

const Players = ({ messagesService, userOriginal }) => {

    const [users, setUsers] = useState([])

    useEffect(() => {

        let usersServerList = []

        const pm = {
            id: userOriginal.id,
            up: false,
            down: false,
            left: false,
            right: false,
            space: false,
            shoot: null,
        }

        let sendUpdate = false

        messagesService.getGameState((gameState) => {
            if (gameState.usersChanged) {
                usersServerList.push(gameState.users)
            }
        })

        const keyDownHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") return

            if (e.keyCode === 68 || e.keyCode === 39) {
                if (!pm.right) pm.right = true 
            }
            else if (e.keyCode === 65 || e.keyCode === 37) {
                if (!pm.left) pm.left = true 
            }
            else if (e.keyCode === 87 || e.keyCode === 38) {
                if (!pm.up) pm.up = true 
            }
            else if (e.keyCode === 83 || e.keyCode === 40) {
                if (!pm.down) pm.down = true 
            }
            else if (e.keyCode === 32) {
                if (!pm.space) pm.space = true 
            }
            sendUpdate = true
        }

        const keyUpHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") return

            if (e.keyCode === 68 || e.keyCode === 39) {
                if (pm.right) pm.right = false
            }
            else if (e.keyCode === 65 || e.keyCode === 37) {
                if (pm.left) pm.left = false
            }
            else if (e.keyCode === 87 || e.keyCode === 38) {
                if (pm.up) pm.up = false 
            }
            else if (e.keyCode === 83 || e.keyCode === 40) {
                if (pm.down) pm.down = false
            }
            else if (e.keyCode === 32) {
                if (pm.space) pm.space = false 
            }
            sendUpdate = true
        }

        const mouseClickHandler = (e) => {
            if (e.target.tagName.toUpperCase() === "INPUT") {
                pm.up = false
                pm.left = false
                pm.right = false
                pm.down = false
                pm.space = false
                pm.shoot = null
                sendUpdate = true
                return
            }
            if (e.target.tagName.toUpperCase() === "BUTTON") return
            const x = (e.clientX / window.innerWidth) * 100
            const y = (e.clientY / window.innerHeight) * 100
            pm.shoot = [x, y]
            sendUpdate = true
        }

        const mouseUpHandler = (e) => {
            pm.shoot = null
            sendUpdate = true
        }

        let waitSendMousePos = false
        const mouseOverHandler = (e) => {
            if (!pm.shoot || waitSendMousePos) return
            const x = (e.clientX / window.innerWidth) * 100
            const y = (e.clientY / window.innerHeight) * 100
            pm.shoot = [x, y]
            sendUpdate = true
            waitSendMousePos = true
            setTimeout(() => {
                waitSendMousePos = false
            }, (1000 / 60) * 10)
        }

        const blurHandler = (e) => {
            pm.up = false
            pm.left = false
            pm.right = false
            pm.down = false
            pm.space = false
            pm.shoot = null
            sendUpdate = true
        }

        document.addEventListener('keydown', keyDownHandler, false)
        document.addEventListener('keyup', keyUpHandler, false)
        document.addEventListener('mousedown', mouseClickHandler, false)
        document.addEventListener('mouseup', mouseUpHandler, false)
        document.addEventListener('mousemove', mouseOverHandler, false)
        window.addEventListener('blur', blurHandler, false)


        const sendMovementToServer = () => {
            if (sendUpdate) {
                messagesService.sendPlayerMovement(pm)
                sendUpdate = false
            }
        }

        const handleMovementFromServer = () => {
            const usersServer = usersServerList.shift()
            if (usersServer) {
                window.requestAnimationFrame(() => setUsers(usersServer))
            }
        }

        setInterval(() => {
            sendMovementToServer()
            handleMovementFromServer()
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