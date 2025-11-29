import { useState } from "react"

//importa os formulários de login e registro
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"

export default function Login() {

    const [hasAccount, setHasAccount] = useState(true)

    return (
        <section>
            {hasAccount ? <LoginForm /> : <RegisterForm />}
            <p
                className="changeFormBtn"
                //alterna entre os formulários
                onClick={() => setHasAccount(!hasAccount)}
            >
                {hasAccount ? "Não possui conta? Crie uma!" : "Já possui conta? Entrar!"}
            </p>
        </section>
    )
}