import { Button } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";

interface HeaderProps {
    title: string;
    appName: string;
    lang: string;
    onLangToggle: () => void;
}

export function Header({ title, appName, lang, onLangToggle }: HeaderProps) {
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

                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-circle border-0 text-light"
                        style={{ backgroundColor: "#2d2d2d" }}
                    >
                        <GearFill />
                    </Button>
                </div>
            </div>

            <h5 className="fw-semibold text-light mt-3 mb-0">{title}</h5>
        </header>
    );
}