import { Button } from "react-bootstrap";
import { KeyFill, PeopleFill } from "react-bootstrap-icons";

interface FooterProps {
    activeTab: "passwords" | "trusted";
    onChange: (tab: "passwords" | "trusted") => void;
    t: Record<string, string>;
}

export function Footer({ activeTab, onChange, t }: FooterProps) {
    return (
        <footer
            className="border-top border-secondary bg-dark position-fixed bottom-0 start-0 end-0"
            style={{ zIndex: 1000, height: "58px" }}
        >
            <div className="d-flex justify-content-around align-items-center h-100">
                <Button
                    variant="link"
                    className={`text-decoration-none d-flex flex-column align-items-center ${
                        activeTab === "passwords" ? "text-primary" : "text-secondary"
                    }`}
                    onClick={() => onChange("passwords")}
                >
                    <KeyFill size={18} />
                    <small>{t.passwords}</small>
                </Button>

                <Button
                    variant="link"
                    className={`text-decoration-none d-flex flex-column align-items-center ${
                        activeTab === "trusted" ? "text-primary" : "text-secondary"
                    }`}
                    onClick={() => onChange("trusted")}
                >
                    <PeopleFill size={18} />
                    <small>{t.trusted}</small>
                </Button>
            </div>
        </footer>
    );
}
