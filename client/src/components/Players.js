import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'
import Users from "./Users"
import { useState, useEffect } from 'react'

const Players = React.memo(({ messagesService, userOriginal }) => {

    const [users, setUsers] = useState([])

    useEffect(() => {

        let usersServerList = []

        const pm = {
            id: userOriginal.socketID,
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
            }, 1000 / 60 * 5)
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

        document.addEventListener('keydown', keyDownHandler, true)
        document.addEventListener('keyup', keyUpHandler, true)
        document.addEventListener('mousedown', mouseClickHandler, true)
        document.addEventListener('mouseup', mouseUpHandler, true)
        document.addEventListener('mousemove', mouseOverHandler, true)
        window.addEventListener('blur', blurHandler, true)


        const sendMovementToServer = () => {
            if (sendUpdate) {
                messagesService.sendPlayerMovement(pm)
                sendUpdate = false
            }
        }

        const handleMovementFromServer = () => {
            const usersServer = usersServerList.shift()
            if (usersServerList.length > 60) {
                const usersLast = usersServerList[usersServerList.length - 1]
                usersServerList = []
                window.requestAnimationFrame(() => setUsers(usersLast))
            }
            else if (usersServer) {
                window.requestAnimationFrame(() => setUsers(usersServer))
            }
        }

        messagesService.pingServer()
        setInterval(() => {
            messagesService.pingServer()
        }, 5000)

        setInterval(() => {
            sendMovementToServer()
            handleMovementFromServer()
        }, 1000 / 60)

    }, [messagesService, userOriginal])


    return (
        <>
            <Users
                users={users}
                messagesService={messagesService}
                userOriginal={userOriginal} />
            <ul>
                {users.map(u => {
                    if (u.socketID !== userOriginal.socketID) {
                        return (
                            <PlayerOther
                                key={u.socketID}
                                user={u} />
                        )
                    }
                    else {
                        return (
                            <PlayerClient
                                key={u.socketID}
                                user={u} />
                        )
                    }
                })}
            </ul>
        </>
    )
})



export default Players