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
        width: "8vh",
        height: "8vh",
    }

    const stylePicture = {
        width: "6vh",
        height: "6vh",
        padding: "0px",
        margin: "auto",
        display: "block",
        border: ".3rem solid",
        zIndex: "9999999999",
        borderColor: user.color,
    }

    const styleShield = {
        position: "relative",
        width: "7vh",
        height: "7vh",
        top: "-5vh",
        left: "3vh",
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
