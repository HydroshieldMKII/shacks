import type { ReactNode } from "react";

interface FormContainerProps {
    title?: string; // Ex: "Connexion", "S’inscrire"
    children: ReactNode;
}

export function FormContainer({ title, children }: FormContainerProps) {
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
                {title && (
                    <h2 className="text-center mb-4 fw-semibold">{title}</h2>
                )}
                {children}
            </div>
        </div>
    );
}