import React from "react"
import Bullet from "./Bullet"

const Bullets = ({ bullets, usernameChosen }) => {

    console.log(bullets)

    if (!usernameChosen) return null
    else return (
        <ul>
            {bullets.map(b => {
                return (
                    <Bullet
                        bullet={b}
                        key={b.id} />
                )
            })}
        </ul>
    )
}

export default Bullets