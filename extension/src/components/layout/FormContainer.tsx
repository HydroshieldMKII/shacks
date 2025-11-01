import type { ReactNode } from "react";

interface FormContainerProps {
    title: string;
    children: ReactNode;
}

export function FormContainer({ title, children }: FormContainerProps) {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-dark text-light vh-100 w-100 p-3">
            <div className="w-100" style={{ maxWidth: "360px" }}>
                <h2 className="text-center mb-3 text-primary fw-bold fs-4">{title}</h2>
                {children}
            </div>
        </div>
    );
}