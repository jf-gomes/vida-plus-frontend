import Supplies from "../components/Supplies"
import Rooms from "../components/Rooms"
import Prescriptions from "../components/Prescriptions"
import { useState } from "react"
import Users from "../components/Users"

export default function Home(){

    const [selectedMenu, setSelectedMenu] = useState<string>('users')

    function componentToRender(menu: string) {
        if (menu == 'supplies') {
            return <Supplies />
        } else if (menu == 'prescriptions') {
            return <Prescriptions />
        } else if (menu == 'rooms') {
            return <Rooms />
        } else {
            return <Users />
        }
    }

    return (

        <>
            <nav>
                <ul>
                    <li onClick={() => setSelectedMenu('users')}>Usuários</li>
                    <li onClick={() => setSelectedMenu('supplies')}>Estoque</li>
                    <li onClick={() => setSelectedMenu('prescriptions')}>Receitas</li>
                    <li onClick={() => setSelectedMenu('rooms')}>Quartos</li>
                </ul>
            </nav>
            {componentToRender(selectedMenu)}
        </>

        
    )
}