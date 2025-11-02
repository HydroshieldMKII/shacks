import type { ReactNode } from "react";
import { Button } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

interface FormContainerProps {
    title?: string; // Ex: "Connexion", "S'inscrire"
    children: ReactNode;
    showBackButton?: boolean;
    backPath?: string;
}

export function FormContainer({ title, children, showBackButton = true, backPath = "/home" }: FormContainerProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(backPath);
    };

    return (
        <div
            className="d-flex flex-column align-items-center text-light w-100"
            style={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#121212",
                overflowY: "auto",
                padding: "2rem 1rem",
            }}
        >
            <div className="w-100" style={{ maxWidth: "360px" }}>
                {showBackButton && (
                    <div className="mb-3">
                        <Button
                            variant="link"
                            className="text-light p-0 text-decoration-none d-flex align-items-center"
                            onClick={handleBack}
                        >
                            <ArrowLeft size={20} className="me-2" />
                            Back
                        </Button>
                    </div>
                )}
                {title && (
                    <h2 className="text-center mb-4 fw-semibold">{title}</h2>
                )}
                {children}
            </div>
        </div>
    );
}