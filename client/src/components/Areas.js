import React from "react"
import AreaDelete from "./AreaDelete"
import AreaStartGame from "./AreaStartGame"

const Areas = ({ users, user, msgService }) => {

    return (
        <div>
            <AreaDelete 
                msgService={msgService}
                users={users}
                user={user} />
            <AreaStartGame 
                users={users}/>
        </div>
    )
}

export default Areas