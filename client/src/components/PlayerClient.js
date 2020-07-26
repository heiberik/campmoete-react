import React from "react"
import char from "../images/char.png"
import shieldPic from "../images/shield.png"

const PlayerClient = React.memo(({ user }) => {

    const stylePlayer = {
        position: "absolute",
        width: user.playerWidth + "vw",
        height: user.playerHeight + "vh",
        top: user.playerPosY + "vh",
        left: user.playerPosX + "vw",
        padding: "0px",
        margin: "0px",
        zIndex: "9999999999999",
        borderRadius: "1vh",
        background: user.color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }

    const stylePicture = {
        width: "80%",
        height: "80%",
        display: "block",
        borderRadius: ".8vh",
        padding: "0px",
        margin: "0px",
        zIndex: "999999999999",
        borderColor: user.color,
        userDrag: "none",
        userSelect: "none",
        WebkitUserDrag: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
    }

    const styleShield = {
        position: "absolute",
        width: user.playerWidth + "vw",
        height: user.playerHeight + "vh",
        top: user.playerPosY + 1 + "vh",
        left: user.playerPosX + 1 + "vw",
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
            <>
                <div style={stylePlayer}>
                    <img style={stylePicture} src={char} alt="character" />
                </div>
                <img style={styleShield} src={shieldPic} alt="shield" />
            </>
        )
    }
    else return (
        <div style={stylePlayer}>
            <img style={stylePicture} src={char} alt="character" />
        </div>
    )

})

export default PlayerClient
