import { Form } from "react-bootstrap";

interface InputTextProps {
    id: string;
    label: string;
    hint?: string;
    error?: string;
}

export function InputText({ id, label, hint, error }: InputTextProps) {
    return (
        <Form.Group className="mb-3" controlId={id}>
            <Form.Label className="fw-semibold small">{label}</Form.Label>
            <Form.Control
                type="text"
                className={`form-control-sm bg-dark text-light border-secondary ${error ? "is-invalid" : ""}`}
            />
            {error ? (
                <Form.Control.Feedback type="invalid" className="text-danger small">
                    {error}
                </Form.Control.Feedback>
            ) : (
                hint && <Form.Text className="text-secondary small">{hint}</Form.Text>
            )}
        </Form.Group>
    );
}