import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import "./styles/css/index.css";
import "./styles/scss/custom.scss";
import Login from "./pages/login.tsx";
import Signup from "./pages/signup.tsx";
import PasswordDetail from "./pages/password-details.tsx";
import PasswordList from "./pages/password-list.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/passwords">
                    <Route index element={<PasswordList />} />
                    <Route path=":id" element={<PasswordDetail />} />
                </Route>
            </Routes>
        </HashRouter>
    </StrictMode>
);
