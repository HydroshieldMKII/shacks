import { Form } from "react-bootstrap";

interface InputEmailProps {
    label: string;
    hint: string;
    error?: string;
}

export function InputEmail({ label, hint, error }: InputEmailProps) {
    return (
        <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="fw-semibold small">{label}</Form.Label>
            <Form.Control
                type="email"
                className={`form-control-sm bg-dark text-light border-secondary ${
                    error ? "is-invalid" : ""
                }`}
            />
            {error ? (
                <Form.Control.Feedback type="invalid" className="text-danger small">
                    {error}
                </Form.Control.Feedback>
            ) : (
                <Form.Text className="text-secondary small">{hint}</Form.Text>
            )}
        </Form.Group>
    );
}