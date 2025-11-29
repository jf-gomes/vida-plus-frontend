import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

//importação dos estilos
import './index.css'

//importação das rotas
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      {/* página de login e cadastro */}
      <Route path="/" element={<Login />} />
      {/* página principal (quando o usuário estiver logado) */}
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
  
)
