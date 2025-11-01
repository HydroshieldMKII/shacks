import { useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer"; // ✅ nouveau nom
import { PasswordSection } from "../components/sections/PasswordSection";
import { TrustedSection } from "../components/sections/TrustedSection";

function Home() {
    const [tab, setTab] = useState<"passwords" | "trusted">("passwords");

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
            {/* 🔹 En-tête fixe */}
            <Header title={tab === "passwords" ? "Mots de passe" : "Personnes de confiance"} />

            {/* 🔹 Contenu principal */}
            <main
                style={{
                    paddingTop: "7rem",
                    paddingBottom: "5rem",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                }}
            >
                {tab === "passwords" ? <PasswordSection /> : <TrustedSection />}
            </main>

            {/* 🔹 Pied de page fixe */}
            <Footer activeTab={tab} onChange={setTab} />
        </div>
    );
}

export default Home;