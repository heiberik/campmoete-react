import React from "react"
import char from "../images/char.png"
import shieldPic from "../images/shield.png"

const PlayerClient = React.memo(({ user }) => {

    const x = Math.round((user.playerPosX + Number.EPSILON) * 100) / 100
    const y = Math.round((user.playerPosY + Number.EPSILON) * 100) / 100

    const stylePlayer = {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        top: y + "vh",
        left: x + "vw",
        padding: "0px",
        margin: "0px",
        zIndex: "9999999999999",
        width: "2.5rem",
        height: "2.5rem",
        animationTimingFunction: "ease-in-out",
        WebkitAnimationTimingFunction: "ease-in-out",
        transition: "transform 1s ease-in-out 0s",
    }

    const stylePicture = {
        width: "3vw",
        height: "4vh",
        padding: "0px",
        margin: "auto",
        display: "block",
        border: ".5vh solid",
        borderRadius: "1.2vh",
        zIndex: "999999999999",
        AnimationTimingFunction: "ease-in-out",
        WebkitAnimationTimingFunction: "ease-in-out",
        transition: "transform 1s ease-in-out 0s",
        borderColor: user.color,
        userDrag: "none",
        userSelect: "none",
        WebkitUserDrag: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
    }

    const styleShield = {
        position: "relative",
        animationTimingFunction: "ease-in-out",
        WebkitAnimationTimingFunction: "ease-in-out",
        transition: "transform 1s ease-in-out 0s",
        width: "3rem",
        height: "3rem",
        top: "-2.2rem",
        left: "1.4rem",
        zIndex: "999999999999",
        userDrag: "none",
        userSelect: "none",
        WebkitUserDrag: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
    }

    if (!user) {
        return null
    }
    else if (user.shield) {
        return (
            <div style={stylePlayer}>
                <img style={stylePicture} src={char} alt="character" />
                <img style={styleShield} src={shieldPic} alt="shield" />
            </div>
        )
    }
    else return (
        <div style={stylePlayer}>
            <img style={stylePicture} src={char} alt="character" />
        </div>
    )

})

export default PlayerClient
