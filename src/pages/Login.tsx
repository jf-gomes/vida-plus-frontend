import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"

import { useState } from "react"

export default function Login() {

    const [hasAccount, setHasAccount] = useState(true)

    return (
        <section className="loginSection">
            {hasAccount ? <LoginForm /> : <RegisterForm />}
            <p className="changeFormBtn" onClick={() => setHasAccount(!hasAccount)} >{hasAccount ? "Não possui conta? Crie uma!" : "Já possui conta? Entrar!"}</p>
        </section>
    )
}