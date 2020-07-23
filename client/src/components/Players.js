import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'
import Users from "./Users"
import { useState, useEffect } from 'react'


const Players = ({ messagesService, userOriginal }) => {

    const [users, setUsers] = useState([])
    const [user, setUser] = useState([userOriginal, false])
    const [latency, setLatency] = useState(0)
    const [moves, setMoves] = useState([])

    useEffect(() => {

        messagesService.getGameState((gameState) => {

            if (gameState.usersChanged) {
                window.requestAnimationFrame(() => setUsers(gameState.users))
            }
            if (gameState.freezeGameChanged) {
                window.requestAnimationFrame(() => setUser(u => [u[0], gameState.freezeGame]))
            }
            if (gameState.usersChanged) {

                const userServerState = gameState.users.find(us => us.id === userOriginal.id)

                setMoves(m => {

                    const userClientState = m.find(move => move.updateSeq === userServerState.updateSeq)
                    if (!userClientState) return m

                    console.log(userServerState)
                    console.log(userClientState)


                    if (userServerState.playerPosX === userClientState.playerPosX &&
                        userServerState.playerPosY === userClientState.playerPosY) {
                        console.log("RIKTIG!")
                    }
                    else {
                        console.log("FEIL!")
                        setUser(u => [userServerState, u[1]])
                    }

                    const newList = m.filter(move => { return move.updateSeq >= userServerState.updateSeq })
                    console.log(newList)
                    return newList
                })

            }


        })

        messagesService.getPongServer((time) => {
            setLatency(time)
        })

        const handleUserInput = () => {

            const pm = {
                up: false,
                down: false,
                left: false,
                right: false,
                space: false,
                shoot: null,
                updateSeq: 0,
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

            document.addEventListener('keydown', keyDownHandler, false)
            document.addEventListener('keyup', keyUpHandler, false)
            document.addEventListener('mousedown', mouseClickHandler, false)
            document.addEventListener('mouseup', mouseUpHandler, false)
            document.addEventListener('mousemove', mouseOverHandler, false)

            let moveSpeed1 = .4
            let moveSpeed2 = .20

            let counter = 0
            const loop = () => {
                counter++
                if (counter === 60) {
                    counter = 0
                    messagesService.pingServer()
                }

                if (pm.up || pm.down || pm.left || pm.right || pm.space || setFalse || pm.shoot) {

                    setFalse = false

                    setUser(u => {

                        pm.updateSeq++
                        messagesService.sendPlayerMovement(pm)

                        if (u[1]) return u

                        let newPosX = u[0].playerPosX
                        let newPosY = u[0].playerPosY

                        if (pm.up && pm.left) {
                            newPosX = newPosX - moveSpeed2
                            newPosY = newPosY - moveSpeed2
                        }
                        else if (pm.up && pm.right) {
                            newPosX = newPosX + moveSpeed2
                            newPosY = newPosY - moveSpeed2
                        }
                        else if (pm.down && pm.left) {
                            newPosX = newPosX - moveSpeed2
                            newPosY = newPosY + moveSpeed2
                        }
                        else if (pm.down && pm.right) {
                            newPosX = newPosX + moveSpeed2
                            newPosY = newPosY + moveSpeed2
                        }
                        else if (pm.up) newPosY = newPosY - moveSpeed1
                        else if (pm.down) newPosY = newPosY + moveSpeed1
                        else if (pm.left) newPosX = newPosX - moveSpeed1
                        else if (pm.right) newPosX = newPosX + moveSpeed1

                        if (newPosX > 101) newPosX = newPosX - moveSpeed1
                        if (newPosX < -1) newPosX = newPosX + moveSpeed1
                        if (newPosY > 101) newPosY = newPosY - moveSpeed1
                        if (newPosY < -1) newPosY = newPosY + moveSpeed1

                        const newuser = {
                            ...u[0],
                            updateSeq: pm.updateSeq,
                            shield: pm.space,
                            playerPosX: newPosX,
                            playerPosY: newPosY,
                        }

                        setMoves(m => {
                            return m.concat(newuser)
                        })

                        return [newuser, u[1]]
                    })
                }
            }

            setInterval(() => {
                window.requestAnimationFrame(loop)
            }, 1000 / 60);
        }

        handleUserInput()

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
                                key={user[0].id}
                                user={user[0]} />
                        )
                    }
                })}
            </ul>
        </>
    )
}



export default Players