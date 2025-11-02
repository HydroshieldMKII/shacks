import { Button } from "react-bootstrap";
import { Key, Trash3Fill } from "react-bootstrap-icons";

interface TrustedItemProps {
    name: string;
    onRemove?: () => void;
    onShowKey?: () => void; // For "People I Protect" - show guardianKeyValue
    showKeyButton?: boolean; // Whether to show the key button
}

export function TrustedElement({ name, onRemove, onShowKey, showKeyButton }: TrustedItemProps) {
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
                {showKeyButton && (
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="p-0 border-0 text-warning"
                        onClick={onShowKey}
                        title="Show guardian key"
                    >
                        <Key size={16} />
                    </Button>
                )}
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-0 border-0 text-danger"
                    onClick={onRemove}
                    title="Remove guardian"
                >
                    <Trash3Fill size={15} />
                </Button>
            </div>
        </div>
    );
}