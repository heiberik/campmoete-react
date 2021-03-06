import React from "react"

const Bullet = React.memo(({ bullet }) => {

    const bulletStyle = {
        position: "absolute",
        top: bullet.posY+"vh",
        left: bullet.posX+"vw",
        border: "solid "+ bullet.width + "vw black",
        borderRadius: bullet.width + "vw",
        borderColor: bullet.color,
        zIndex: "9999999999999999999999999999999",
    }

    return (
        <div style={bulletStyle}></div>
    )
})

export default Bullet