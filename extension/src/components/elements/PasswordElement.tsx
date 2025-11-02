import { ChevronRight } from "react-bootstrap-icons";

interface PasswordItemProps {
    name: string;
    onClick?: () => void;
}

export function PasswordElement({ name, onClick }: PasswordItemProps) {
    return (
        <div
            className="d-flex justify-content-between align-items-center rounded-3 bg-dark border border-secondary mb-2 px-3 py-2 user-select-none"
            style={{
                transition: "background-color 0.2s ease",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <span className="fw-medium text-light">{name}</span>
            <ChevronRight size={16} className="text-light" />
        </div>
    );
}