import React from "react"


const Skammekroken = ({ showSkammekroken }) => {

    const styleSkam = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        textFamily: "Arial",
        fontWeight: "bold",
        fontSize: "1.5rem",
        position: "absolute",
        bottom: "4.5rem",
        right: "0.5vw",
        height: "10rem",
        width: "10rem",
        background: "purple",
        color: "pink",
        border: "solid 2px pink",
        borderRadius: ".2rem",
    }

    if (!showSkammekroken) return null
    else return (
        <div style={styleSkam}>
            Corner of Shame
        </div>
    )
}



export default Skammekroken