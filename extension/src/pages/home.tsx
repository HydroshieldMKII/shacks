import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { locales, type LocaleKey } from "../locales";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { PasswordSection } from "../components/sections/PasswordSection";
import { TrustedSection } from "../components/sections/TrustedSection";
import authService from "../services/authService";

function Home() {
    const [lang, setLang] = useState<LocaleKey>("fr");
    const [tab, setTab] = useState<"passwords" | "trusted">("passwords");
    const navigate = useNavigate();

    // ✅ Langue persistée dans localStorage
    useEffect(() => {
        const storedLang = localStorage.getItem("trust_lang");
        if (storedLang === "fr" || storedLang === "en") {
            setLang(storedLang);
        } else {
            const userLang = navigator.language.startsWith("fr") ? "fr" : "en";
            setLang(userLang as LocaleKey);
            localStorage.setItem("trust_lang", userLang);
        }
    }, []);

    const toggleLang = () => {
        const newLang = lang === "fr" ? "en" : "fr";
        setLang(newLang);
        localStorage.setItem("trust_lang", newLang);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // Même en cas d'erreur, rediriger vers la page de connexion
            navigate('/');
        }
    };

    const t = locales[lang];

    return (
        <div
            className="bg-dark text-light position-relative"
            style={{
                width: "100%",
                maxWidth: 400,
                minHeight: "100vh",
                overflow: "hidden",
            }}
        >
            <Header
                title={tab === "passwords" ? t.home.passwords : t.home.trusted}
                appName={t.app_name}
                lang={lang}
                onLangToggle={toggleLang}
                onLogout={handleLogout}
            />

            {/* ✅ plus de padding haut et bas */}
            <main
                className="px-3"
                style={{
                    paddingTop: "7.5rem", // espace sous le header
                    paddingBottom: "5.5rem", // espace pour le footer
                    overflowY: "auto",
                    scrollbarWidth: "none",
                }}
            >
                {tab === "passwords" ? (
                    <PasswordSection 
                        t={t.home} 
                        onAddPassword={() => navigate('/passwords/add')}
                        onEditPassword={(id) => navigate(`/passwords/edit/${id}`)}
                    />
                ) : (
                    <TrustedSection 
                        t={t.home} 
                        onAddTrusted={() => navigate('/trusted/add')}
                        onEditTrusted={(id: number) => navigate(`/trusted/edit/${id}`)}
                    />
                )}
            </main>

            <Footer activeTab={tab} onChange={setTab} t={t.footer} />
        </div>
    );
}

export default Home;