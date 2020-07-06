import React from "react"
import AreaDelete from "./AreaDelete"
import AreaStartGame from "./AreaStartGame"

const Areas = ({ usernameChosen, numbersDeleteEvent, numbersGameEvent }) => {

    return (
        <div>
            <AreaDelete 
                numbersDeleteEvent={numbersDeleteEvent} 
                usernameChosen={usernameChosen} />
            <AreaStartGame 
                usernameChosen={usernameChosen}
                numbersGameEvent={numbersGameEvent} />
        </div>
    )
}

export default Areas