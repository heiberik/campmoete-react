import React from "react"

const Background = ({color1, color2}) => {

    const style = {
        listStyleType: "none",
        margin: "0px",
        padding: "0px",
        flexGrow: "1",
        background: "radial-gradient("+color1+", "+color2+")"
    }

    return (
        <div style={style}></div>
    )
}

export default Background