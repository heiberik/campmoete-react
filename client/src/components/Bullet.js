import React from "react"

const Bullet = ({ bullet }) => {

    const bulletStyle = {
        position: "absolute",
        top: bullet.posY+"vh",
        left: bullet.posX+"vw",
        border: "solid 0.5rem black",
        borderRadius: "0.25rem",
    }

    return (
        <div style={bulletStyle}></div>
    )
}

export default Bullet