import React from "react"
import char from "../images/char5.png"
import shieldPic from "../images/shield.png"

const PlayerOther = ({ user }) => {

    const stylePlayer = {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        top: user.playerPosY + "vh",
        left: user.playerPosX + "vw",
        padding: "0px",
        margin: "0px",
        zIndex: "9999999999",
        width: "2.5rem",
        height: "2.5rem",
    }

    const stylePicture = {
        width: "4vh",
        height: "4vh",
        padding: "0px",
        margin: "auto",
        display: "block",
        border: ".3rem solid",
        zIndex: "9999999999",
        borderColor: user.color,
    }

    const styleShield = {
        position: "relative",
        width: "3rem",
        height: "3rem",
        top: "-2.2rem",
        left: "1.4rem",
        zIndex: "999999999999",
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
