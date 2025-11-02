import { Button } from "react-bootstrap";
import { EyeFill, PencilFill } from "react-bootstrap-icons";

interface PasswordItemProps {
    name: string;
    onView?: () => void;
    onEdit?: () => void;
}

export function PasswordElement({ name, onView, onEdit }: PasswordItemProps) {
    return (
        <div
            className="d-flex justify-content-between align-items-center rounded-3 bg-dark border border-secondary mb-2 px-3 py-2 user-select-none"
            style={{
                transition: "background-color 0.2s ease",
                cursor: "pointer",
            }}
        >
            <span className="fw-medium">{name}</span>
            <div className="d-flex align-items-center gap-2">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-0 border-0 text-light"
                    onClick={onView}
                >
                    <EyeFill size={16} />
                </Button>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-0 border-0 text-light"
                    onClick={onEdit}
                >
                    <PencilFill size={15} />
                </Button>
            </div>
        </div>
    );
}