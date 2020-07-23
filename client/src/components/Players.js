import React from "react"
import PlayerClient from './PlayerClient'
import PlayerOther from './PlayerOther'
import Users from "./Users"
import { useState, useEffect } from 'react'


const Players = ({ messagesService, userOriginal }) => {

    const [users, setUsers] = useState([])
    //const [user, setUser] = useState(userOriginal)

    useEffect(() => {

        const moveSpeed1 = .4
        const moveSpeed2 = .20
        let userClient = userOriginal
        let tickCounter = 0
        let freeze = false
        let movesClient = []
        let usersServer = []
        let movesServer = []
        let latency = 0

        const pm = {
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
                //const us = usersServer.find(us => us.id === userOriginal.id)
                //if (us) movesServer.push(us)
            }
            if (gameState.freezeGameChanged) {
                if (!gameState.freezeGame){
                    setTimeout(() =>  freeze = gameState.freezeGame, 1000)
                }
                else freeze = gameState.freezeGame
            }
        })

        messagesService.getPongServer((time) => {
            latency = time
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


        const tick = () => {

            /*
            tickCounter++
            if (tickCounter === 60) {
                tickCounter = 0
                messagesService.pingServer()
            }
            */

            if (pm.up || pm.down || pm.left || pm.right || pm.space || setFalse || pm.shoot) {


                messagesService.sendPlayerMovement(pm)
                setFalse = false
                /*
                if (!freeze) {
                    setFalse = false

                    
                    let newPosX = userClient.playerPosX
                    let newPosY = userClient.playerPosY

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

                    pm.updateSeq++
                    const newUserClient = {
                        ...userClient,
                        updateSeq: pm.updateSeq,
                        shield: pm.space,
                        playerPosX: newPosX,
                        playerPosY: newPosY,
                    }

                    userClient = newUserClient
                    movesClient.push(userClient)
                    

                    messagesService.sendPlayerMovement(pm)
                }
                */
            }
        }

        let lastNumberFromServer = 0
        const checkStatus = () => {

            const sm = movesServer.shift()
            if (sm) {

                if (sm.updateSeq === lastNumberFromServer) {
                    userClient = sm
                    return
                }

                lastNumberFromServer = sm.updateSeq

                const cm = movesClient.find(m => m.updateSeq === sm.updateSeq)
                if (!cm) {
                    userClient = sm
                    movesClient = []
                    return
                }

                if (cm.playerPosX === sm.playerPosX && cm.playerPosY === sm.playerPosY) {
                    movesClient = movesClient.filter(move => { return move.updateSeq >= sm.updateSeq })
                }
                else {
                    movesClient = []
                    movesServer = []
                    userClient = sm
                }
            }
        }


        setInterval(() => {
            tick()
            //checkStatus()
            setUsers(usersServer)
            //setUser(userClient)

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