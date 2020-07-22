import React from "react"
import char from "../images/char.png"
import shieldPic from "../images/shield.png"

const PlayerClient = ({ user }) => {
    
    const stylePlayer = {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        top: user.playerPosY + "vh",
        left: user.playerPosX + "vw",
        padding: "0px",
        margin: "0px",
        zIndex: "9999999999999",
        width: "2.5rem",
        height: "2.5rem",
        animationTimingFunction: "ease-in-out",
        WebkitAnimationTimingFunction: "ease-in-out",
        transition:"transform 1s ease-in-out 0s",
    }

    const stylePicture = {
        width: "3vw",
        height: "4vh",
        padding: "0px",
        margin: "auto",
        display: "block",
        border: ".5vh solid",
        zIndex: "999999999999",
        AnimationTimingFunction: "ease-in-out",
        WebkitAnimationTimingFunction: "ease-in-out",
        transition:"transform 1s ease-in-out 0s",
        borderColor: user.color,
    }

    const styleShield = {
        position: "relative",
        animationTimingFunction: "ease-in-out",
        WebkitAnimationTimingFunction: "ease-in-out",
        transition:"transform 1s ease-in-out 0s",
        width: "3rem",
        height: "3rem",
        top: "-2.2rem",
        left: "1.4rem",
        zIndex: "999999999999",
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

}

export default PlayerClient
