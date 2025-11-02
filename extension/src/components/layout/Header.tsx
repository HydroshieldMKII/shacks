import { BoxArrowRight } from "react-bootstrap-icons";

interface HeaderProps {
    title: string;
    appName: string;
    lang: string;
    onLangToggle: () => void;
    onLogout: () => void;
}

export function Header({ title, appName, lang, onLangToggle, onLogout }: HeaderProps) {
    return (
        <header
            className="border-bottom border-secondary p-3 position-fixed top-0 start-0 end-0 bg-dark"
            style={{ zIndex: 1000 }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="fw-bold text-primary fs-4 mb-0 user-select-none">{appName}</h1>

                <div className="d-flex align-items-center gap-2">
                    <small
                        className="text-secondary"
                        style={{ cursor: "pointer", userSelect: "none" }}
                        onClick={onLangToggle}
                    >
                        {lang === "fr" ? "FR | EN" : "EN | FR"}
                    </small>

                    <button
                        className="btn border-0 p-2"
                        onClick={onLogout}
                        title={lang === "fr" ? "Déconnexion" : "Logout"}
                        style={{ 
                            backgroundColor: "transparent",
                            color: "#6c757d",
                            transition: "color 0.2s ease",
                            cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#dc3545";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#6c757d";
                        }}
                    >
                        <BoxArrowRight size={16} />
                    </button>
                </div>
            </div>

            <h5 className="fw-semibold text-light mt-3 mb-0">{title}</h5>
        </header>
    );
}