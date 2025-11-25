import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc2NDAzMTAyNywiZXhwIjoxNzY0MTE3NDI3fQ.YPmYW_odJcHmHzniBIbZTN-U2_MsOq5XYtLIDZ9nDLU' />} />
    </Routes>
  </BrowserRouter>
  
)
