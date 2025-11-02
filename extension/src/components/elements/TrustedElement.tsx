import { Button } from "react-bootstrap";
import { PersonFillGear, Trash3Fill } from "react-bootstrap-icons";

interface TrustedItemProps {
    name: string;
    onEdit?: () => void;
    onRemove?: () => void;
}

export function TrustedElement({ name, onEdit, onRemove }: TrustedItemProps) {
    return (
        <div
            className="d-flex justify-content-between align-items-center rounded-3 bg-dark border border-secondary mb-2 px-3 py-2 user-select-none"
            style={{
                transition: "background-color 0.2s ease",
                cursor: "pointer",
            }}
        >
            <span className="fw-medium text-light">{name}</span>
            <div className="d-flex align-items-center gap-2">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-0 border-0 text-light"
                    onClick={onEdit}
                >
                    <PersonFillGear size={16} />
                </Button>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-0 border-0 text-danger"
                    onClick={onRemove}
                >
                    <Trash3Fill size={15} />
                </Button>
            </div>
        </div>
    );
}