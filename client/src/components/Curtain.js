import React from "react"
import { useRef, useEffect } from 'react'

const Curtain = React.memo(({ messagesService }) => {

    const curtain = useRef(null)

    useEffect(() => {

        messagesService.getGameState((gameState) => {
            if (gameState.gameInProgressChanged && gameState.gunGameInProgress){
                curtainUp(0.001)
                curtain.current.style.visibility = "visible"
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
            else {
                curtain.current.style.visibility = "hidden"
            }
        }

    },[messagesService])

    const style = {
        position: "absolute",
        visibility: "hidden",
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