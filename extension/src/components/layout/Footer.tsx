import { Button } from "react-bootstrap";
import { KeyFill, PeopleFill } from "react-bootstrap-icons";

interface FooterProps {
    activeTab: "passwords" | "trusted";
    onChange: (tab: "passwords" | "trusted") => void;
}

export function Footer({ activeTab, onChange }: FooterProps) {
    return (
        <footer
            className="border-top border-secondary bg-dark position-fixed bottom-0 start-0 end-0"
            style={{ zIndex: 1000, height: "58px" }}
        >
            <div className="d-flex justify-content-around align-items-center h-100">
                <Button
                    variant="link"
                    className={`text-decoration-none d-flex flex-column align-items-center ${
                        activeTab === "passwords" ? "text-success" : "text-secondary"
                    }`}
                    onClick={() => onChange("passwords")}
                >
                    <KeyFill size={18} />
                    <small>Mots de passe</small>
                </Button>

                <Button
                    variant="link"
                    className={`text-decoration-none d-flex flex-column align-items-center ${
                        activeTab === "trusted" ? "text-success" : "text-secondary"
                    }`}
                    onClick={() => onChange("trusted")}
                >
                    <PeopleFill size={18} />
                    <small>Confiance</small>
                </Button>
            </div>
        </footer>
    );
}
