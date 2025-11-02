import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import "./styles/css/index.css";
import "./styles/scss/custom.scss";
import Login from "./pages/login.tsx";
import Signup from "./pages/signup.tsx";
import Recovery from "./pages/recovery.tsx";
import PasswordDetail from "./pages/password-details.tsx";
import PasswordList from "./pages/password-list.tsx";
import Home from "./pages/home.tsx";
import { AddPasswordPage } from "./pages/add-password.tsx";
import { AddTrustedPage } from "./pages/add-trusted.tsx";
import { EditPasswordPage } from "./pages/edit-password.tsx";
import { EditTrustedPage } from "./pages/edit-trusted.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/recovery" element={<Recovery />} />
                <Route path="/home" element={<Home />} />
                <Route path="/passwords">
                    <Route index element={<PasswordList />} />
                    <Route path="add" element={<AddPasswordPage />} />
                    <Route path="edit/:id" element={<EditPasswordPage />} />
                    <Route path=":id" element={<PasswordDetail />} />
                </Route>
                <Route path="/trusted">
                    <Route path="add" element={<AddTrustedPage />} />
                    <Route path="edit/:id" element={<EditTrustedPage />} />
                </Route>
            </Routes>
        </HashRouter>
    </StrictMode>
);
