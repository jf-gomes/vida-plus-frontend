import { useState } from "react"
import Supplies from "../components/Supplies"
import Rooms from "../components/Rooms"
import Prescriptions from "../components/Prescriptions"
import Users from "../components/Users"
import Appointments from "../components/Appointments"

export default function Home(){

    const [selectedMenu, setSelectedMenu] = useState<string>('users')

    function componentToRender(menu: string) {
        if (menu == 'supplies') {
            return <Supplies />
        } else if (menu == 'prescriptions') {
            return <Prescriptions />
        } else if (menu == 'rooms') {
            return <Rooms />
        }  else if (menu == 'appointments') {
            return <Appointments />
        } else {
            return <Users />
        }
    }

    return (

        <>
            {/* menu de navegação */}
            <nav>
                <ul>
                    <li onClick={() => setSelectedMenu('users')}>Usuários</li>
                    <li onClick={() => setSelectedMenu('supplies')}>Estoque</li>
                    <li onClick={() => setSelectedMenu('prescriptions')}>Receitas</li>
                    <li onClick={() => setSelectedMenu('rooms')}>Quartos</li>
                    <li onClick={() => setSelectedMenu('appointments')}>Consultas</li>
                </ul>
            </nav>
            {componentToRender(selectedMenu)}
        </>

        
    )
}