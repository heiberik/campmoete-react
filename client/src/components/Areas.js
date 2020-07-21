import React from "react"
import AreaDelete from "./AreaDelete"
import AreaStartGame from "./AreaStartGame"
import AreaStartGunGame from "./AreaStartGunGame"

const Areas = ({
    usernameChosen,
    numbersDeleteEvent,
    numbersGunGameEvent,
    numbersGameEvent }) => {

    if (!usernameChosen) return null
    else return (
        <div>
            <AreaDelete
                numbersDeleteEvent={numbersDeleteEvent}
                usernameChosen={usernameChosen} />
            <AreaStartGame
                usernameChosen={usernameChosen}
                numbersGameEvent={numbersGameEvent} />
            <AreaStartGunGame
                usernameChosen={usernameChosen}
                numbersGunGameEvent={numbersGunGameEvent} />
        </div>
    )
}

export default Areas