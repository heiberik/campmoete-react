import React from "react"

const Pillar = ({ pillar }) => {

    const styleLine = {
        position: "relative",
        strokeWidth: "2vw",
        stroke: pillar.color,
        zIndex: "600"
    }

    const svgStyle = {
        height: "100%",
        width: "100%",
    }

    const svgContainer = {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
    }


    return (
        <>
            <div style={svgContainer}>
                <svg style={svgStyle}>
                    <line x1={pillar.posX+"vw"} y1="0vh" x2={pillar.posX+"vw"} y2={pillar.top+"vh"} style={styleLine} />
                </svg>
            </div>

            <div style={svgContainer}>
                <svg style={svgStyle}>
                    <line x1={pillar.posX+"vw"} y1={pillar.bottom+"vh"} x2={pillar.posX+"vw"} y2="100vh" style={styleLine} />
                </svg>
            </div>
        </>
    )

}

export default Pillar