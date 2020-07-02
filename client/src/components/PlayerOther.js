import React from "react"
import char from "../images/char5.png"
import shieldPic from "../images/shield.png"

const PlayerOther = ({ user }) => {

    const stylePlayer = {
        position: "absolute",
        transform: "translateX(-50%)",
        top: user.playerPosY + "vh",
        left: user.playerPosX + "vw",
        padding: "0px",
        margin: "0px",
        zIndex: "9999999999",
    }

    const stylePicture = {
        width: "3rem",
        height: "3rem",
        padding: "0px",
        margin: "auto",
        display: "block",
        border: ".3rem solid",
        zIndex: "9999999999",
        borderColor: user.color,
    }

    const styleShield = {
        position: "relative",
        width: "4rem",
        height: "4rem",
        top: "-3rem",
        left: "1.5rem",
        zIndex: "9999999999",
    }


    if (!user) {
        return null
    }
    else if (user.shield){
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

export default PlayerOther
