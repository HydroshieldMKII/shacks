import { Button } from "react-bootstrap";

interface SubmitButtonProps {
    label: string;
}

export function SubmitButton({ label }: SubmitButtonProps) {
    return (
        <div className="d-grid">
            <Button variant="primary" type="submit" className="rounded-3 fw-semibold btn-sm">
                {label}
            </Button>
        </div>
    );
}
