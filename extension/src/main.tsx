import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router'
import './index.css'
import Login from './pages/login.tsx'
import PasswordDetail from './pages/password-details.tsx'
import PasswordList from './pages/password-list.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/passwords">
          <Route index element={<PasswordList />} />
          <Route path=":id" element={<PasswordDetail />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
