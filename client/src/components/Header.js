import React from "react"

const Header = ({ text }) => {

    const style = {
        color: "white",
        background: "#2b2b2b",
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
        margin: "0px",
        fontFamily: "Arial",
        fontSize: "2rem",
        fontWeight: "bold",
        cursor: "auto",
    }

    return (
        <h1 style={style}> { text }</h1>
    )
}

export default Header