import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormContainer } from "../components/forms/FormContainer";
import { EditFormField } from "../components/forms/EditFormField";
import { locales, type LocaleKey } from "../locales";
import guardianService from "../services/guardianService";
import { ApiResponseModel } from "../services/apiService";

export function AddTrustedPage() {
    const [lang] = useState<LocaleKey>("fr");
    const t = locales[lang];
    const navigate = useNavigate();

    const [email, setEmail] = useState(""); // Guardian service only needs email
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!email) {
            setError(t.errors.email_required_trusted);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(t.errors.email_invalid_trusted);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await guardianService.createGuardian(email);

            if (result instanceof ApiResponseModel) {
                // Error response
                setError(result.error || t.home.error_add_trusted);
            } else {
                // Success - navigate back to home
                navigate("/home");
            }
        } catch (err) {
            console.error("Error creating guardian:", err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title={t.trusted.add_title} showBackButton>
            <div className="mb-3">
                <EditFormField 
                    label={t.guardian_email} 
                    value={email} 
                    onChange={handleEmailChange}
                    placeholder="e.g., friend@example.com"
                    error={error || undefined}
                    required={true}
                />
            </div>

            <div className="mb-4">
                <div className="form-text text-light small">
                    {t.trusted.invitation_explanation}
                </div>
            </div>

            <div className="d-flex gap-2">
                <button 
                    className="btn btn-primary"
                    onClick={handleSubmit} 
                    disabled={loading}
                >
                    {loading ? t.actions.adding : t.home.add_person}
                </button>
            </div>
        </FormContainer>
    );
}