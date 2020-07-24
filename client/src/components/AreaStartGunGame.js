import React from "react"

const AreaStartGunGame = ({ numbersGunGameEvent }) => {

    const getOpacity = () => {
        if (numbersGunGameEvent[0]){
            return numbersGunGameEvent[0] / numbersGunGameEvent[1] + .2
        }
        else return 0.2
    }

    const coloredBall = {
        borderRadius: "1.5rem",
        border: "solid 1rem green",
        color: "black",
        background: "green",
        fontWeight: "bold",
        fontFamily: "Arial",
        zIndex: "99999999999999999",
        position: "absolute",
        bottom: ".9rem",
        right: "15vw",
        fontSize: "10px",
        padding: "0px",
        opacity: getOpacity(),
    }

    return <div style={coloredBall}> </div>
}

export default AreaStartGunGame