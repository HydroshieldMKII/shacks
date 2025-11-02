import { Form } from "react-bootstrap";

interface EditFormFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}

export function EditFormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: EditFormFieldProps) {
    return (
        <Form.Group className="mb-3">
            <Form.Label className="text-light fw-semibold">{label}</Form.Label>
            <Form.Control
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-dark text-light border-secondary"
            />
        </Form.Group>
    );
}