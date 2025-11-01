import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

interface InputPasswordProps {
    label: string;
    hint: string;
    error?: string;
}

export function InputPassword({ label, hint, error }: InputPasswordProps) {
    const [show, set_show] = useState(false);

    return (
        <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label className="fw-semibold small">{label}</Form.Label>
            <InputGroup size="sm" hasValidation>
                <Form.Control
                    type={show ? "text" : "password"}
                    className={`bg-dark text-light border-secondary rounded-start-3 ${
                        error ? "is-invalid" : ""
                    }`}
                />
                <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => set_show(!show)}
                    className="rounded-end-3 border-secondary"
                >
                    {show ? <EyeSlashFill /> : <EyeFill />}
                </Button>
                <Form.Control.Feedback type="invalid" className="text-danger small">
                    {error}
                </Form.Control.Feedback>
            </InputGroup>

            {!error && <Form.Text className="text-secondary small">{hint}</Form.Text>}
        </Form.Group>
    );
}