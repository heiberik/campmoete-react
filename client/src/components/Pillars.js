import React from "react"
import Pillar from "./Pillar"

const Pillars = ({ pillars }) => {

    return (
        <ul>
            {pillars.map(p => {
                return (
                    <Pillar
                        pillar={p}
                        key={p} />
                )
            })}
        </ul>
    )

}

export default Pillars