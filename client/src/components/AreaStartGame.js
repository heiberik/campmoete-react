import React from "react"

const AreaStartGame = React.memo(({ numbersGameEvent }) => {

    const getOpacity = () => {
        if (numbersGameEvent[0]){
            return numbersGameEvent[0] / numbersGameEvent[1] + .2
        }
        else return 0.2
    }

    const coloredBall = {
        borderRadius: "1.5rem",
        border: "solid 1rem orange",
        color: "black",
        background: "orange",
        fontWeight: "bold",
        fontFamily: "Arial",
        zIndex: "99999999999999999",
        position: "absolute",
        bottom: ".9rem",
        right: "3vw",
        fontSize: "10px",
        padding: "0px",
        opacity: getOpacity(),
    }

    return <div style={coloredBall}> </div>
    
})

export default AreaStartGame