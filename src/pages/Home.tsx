//import { useState } from "react"
// import Supplies from "../components/Supplies"
// import Rooms from "../components/Rooms"
import Prescriptions from "../components/Prescriptions"

export default function Home({token}: {token: string}){

    return (

        <>
            <nav className="navbar">
                <ul>
                    <li>Estoque</li>
                    <li>Quartos</li>
                    <li>Receitas</li>
                </ul>
            </nav>
            <Prescriptions token={token} />
        </>

        
    )
}