import React from "react"
import Header from "./Header"

const TooSmallScreen = ({ color1, color2, windowSize }) => {

    const style = {
        height: "100%",
        width: "100%",
        position: "absolute",
        zIndex: "999999999999999999999999999999",
        background: "radial-gradient("+color1+", "+color2+")",
    }

    const styleBox = {
        position: "absolute",
        top: "50%",
        left: "50%",
        maxWidth: "800px",
        minWidth: "350px",
        zIndex: "99999999999999999999999999999999",
        transform: "translateX(-50%)",
        padding: "20px",
        margin: "0px",
        background: "orange",
        fontWeight: "bold",
        fontFamily: "Arial",
        fontSize: "16px",
        border: "solid black 2px",
        textAlign: "center",
        borderRadius: "10px",
        cursor: "default",
    }

    if (windowSize[1] > 700 && windowSize[0] > 1000) return null
    else return (
        <div style={style}>
            <Header text="CAMPMØTE" />
            <div style={styleBox}>
                <div> Your screen is too small to attend Campmøte </div> <br/>
                <div> Height {windowSize[1]} (required 700) </div>
                <div> Width {windowSize[0]} (required 1000) </div>
            </div>
        </div>
    )
}

export default TooSmallScreen