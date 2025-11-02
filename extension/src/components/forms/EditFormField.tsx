import { Form } from "react-bootstrap";

interface EditFormFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
}

export function EditFormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
}: EditFormFieldProps) {
    const hasError = !!(error && error.length > 0);
    
    return (
        <Form.Group className="mb-3">
            <Form.Label className="text-light fw-semibold">{label}</Form.Label>
            <Form.Control
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`bg-dark text-light ${hasError ? 'border-danger' : 'border-secondary'}`}
                isInvalid={hasError}
                required={required}
            />
            {hasError && (
                <Form.Control.Feedback type="invalid" className="text-danger small d-block">
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
}