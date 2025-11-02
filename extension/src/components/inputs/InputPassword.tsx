import { Form, InputGroup, Button } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

interface InputPasswordProps {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputPassword({
                                  id,
                                  label,
                                  hint,
                                  error,
                                  showPassword,
                                  setShowPassword,
                                  value,
                                  onChange,
                              }: InputPasswordProps) {
    return (
        <Form.Group className="mb-3" controlId={id}>
            <Form.Label className="fw-semibold small">{label}</Form.Label>
            <InputGroup size="sm" hasValidation>
                <Form.Control
                    type={showPassword ? "text" : "password"}
                    className={`bg-dark text-light border-secondary rounded-start-3 ${error ? "is-invalid" : ""}`}
                    value={value}
                    onChange={onChange}
                />
                <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="rounded-end-3 border-secondary"
                >
                    {showPassword ? <EyeSlashFill /> : <EyeFill />}
                </Button>
                {error && (
                    <Form.Control.Feedback type="invalid" className="text-danger small">
                        {error}
                    </Form.Control.Feedback>
                )}
            </InputGroup>
            {!error && hint && (
                <Form.Text className="text-secondary small">{hint}</Form.Text>
            )}
        </Form.Group>
    );
}