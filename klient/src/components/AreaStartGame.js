import React from "react"
import pig from "../images/pig.png"

const AreaStartGame = ({ users }) => {

    const styleText = {
        position: "absolute",
        transform: "translateX(-50%)",
        fontSize: "3rem",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "orange",
        top: "10vh",
        left: "50vw",
        zIndex: "50"
    }

    const styleImg = {
        zIndex: "999999999",
        position: "absolute",
        height: "3rem",
        bottom: ".8rem",
        right: "2rem",
    }


    return (
        <>
            <img src={pig} style={styleImg} alt="composter" />
        </>
    )

}

export default AreaStartGame