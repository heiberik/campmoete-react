import React from "react"

const Header = ({ text }) => {

    const style = {
        color: "white",
        background: "#2b2b2b",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px",
        margin: "0px",
        height: "4rem",
        fontFamily: "Arial",
        fontSize: "1.7rem",
        fontWeight: "bold",
        cursor: "auto",
        zIndex: "50000",
    }

    return (
        <h1 style={style}> { text }</h1>
    )
}

export default Header