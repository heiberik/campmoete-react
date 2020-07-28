import React from "react"
import { useRef, useEffect } from 'react'

const Curtain = React.memo(({ messagesService }) => {

    const curtain = useRef(null)

    useEffect(() => {

        messagesService.getGameState((gameState) => {
            if (gameState.gameInProgressChanged && gameState.gunGameInProgress){
                curtainUp(0.001)
            }
        })

        const curtainUp = (o) => {
            curtain.current.style.opacity = o
            if (o < 1) setTimeout(() => {curtainUp(o+0.01)}, 1)
            else setTimeout(() => {curtainDown(o)}, 1000)
        }

        const curtainDown = (o) => {
            curtain.current.style.opacity = o
            if (o > 0) setTimeout(() => {curtainDown(o-0.01)}, 1)
            else return 
        }

    },[messagesService])

    const style = {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        opacity: "0.0",
        background: "black",
        height: "100%",
        display: "block",
        zIndex: "999999999999999999999990000009999999999999999",
    }

    return (
        <div style={style} ref={b => curtain.current = b}> d  </div>
    )
})

export default Curtain