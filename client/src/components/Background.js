import React from "react"
import { useRef, useEffect } from 'react'

const Background = React.memo(({ color1, color2, usernameChosen }) => {

    const background = useRef(null)

    useEffect(() => {

        if (usernameChosen) {

            let colorOuter = color2
            let colorInner = color1

            const changeColors = (c) => {
                const rgb = hexToRgb(c)
                if (Math.random() < .5) {
                    rgb.g += 1
                    if (rgb.g > 255) rgb.g -= 1
                }
                else {
                    rgb.g -= 1
                    if (rgb.g < 0) rgb.g += 1
                }
                if (Math.random() < .5) {
                    rgb.b += 1
                    if (rgb.b > 255) rgb.b -= 1
                }
                else {
                    rgb.b -= 1
                    if (rgb.b < 0) rgb.b += 1
                }
                return rgbToHex(rgb.r, rgb.g, rgb.b)
            }

            const hexToRgb = (hex) => {
                var result = /^#?([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            const componentToHex = (c) => {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }

            const rgbToHex = (r, g, b) => {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            }

            
            setInterval(() => {
                colorInner = changeColors(colorInner)
                background.current.style.background = "radial-gradient(" + colorInner + ", " + colorOuter + ")"
            }, 1000 / 60)
            
        }


    }, [color1, color2, usernameChosen])

    const style = {
        listStyleType: "none",
        margin: "0px",
        padding: "0px",
        flexGrow: "1",
        transition: "all 2s ease",
        background: "radial-gradient(" + color1 + ", " + color2 + ")"
    }

    return (
        <div ref={b => background.current = b} style={style}></div>
    )
})

export default Background