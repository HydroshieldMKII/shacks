import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { locales } from "../locales";
import type { LocaleKey } from "../locales";
import { FormContainer } from "../components/forms/FormContainer";
import { InputText } from "../components/inputs/InputText";
import { InputPassword } from "../components/inputs/InputPassword";
import guardianService from "../services/guardianService";

function Recovery() {
    const [lang, set_lang] = useState<LocaleKey>("fr");
    const [show_password, set_show_password] = useState(false);
    const [show_confirm, set_show_confirm] = useState(false);
    const [form_data, set_form_data] = useState({
        email: "",
        key1: "",
        key2: "",
        password: "",
        confirm: ""
    });
    const [errors, set_errors] = useState<{ 
        email?: string; 
        key1?: string; 
        key2?: string; 
        password?: string; 
        confirm?: string; 
        general?: string 
    }>({});
    const [is_loading, set_is_loading] = useState(false);
    const [success_message, set_success_message] = useState<string | null>(null);
    const navigate = useNavigate();

    // ✅ Charger la langue persistée
    useEffect(() => {
        const storedLang = localStorage.getItem("trust_lang");
        if (storedLang === "fr" || storedLang === "en") {
            set_lang(storedLang);
        } else {
            const userLang = navigator.language.startsWith("fr") ? "fr" : "en";
            set_lang(userLang as LocaleKey);
            localStorage.setItem("trust_lang", userLang);
        }
    }, []);

    const toggleLang = () => {
        const newLang = lang === "fr" ? "en" : "fr";
        set_lang(newLang);
        localStorage.setItem("trust_lang", newLang);
    };

    const t = locales[lang];

    const validateForm = () => {
        const new_errors: typeof errors = {};

        // Email validation
        if (!form_data.email.trim()) {
            new_errors.email = t.errors?.email_required || "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form_data.email)) {
            new_errors.email = t.errors?.email_invalid || "Invalid email address.";
        }

        // Guardian key 1 validation
        if (!form_data.key1.trim()) {
            new_errors.key1 = "Guardian key #1 is required.";
        } else if (form_data.key1.trim().length < 8) {
            new_errors.key1 = "Guardian key #1 must be at least 8 characters long.";
        }

        // Guardian key 2 validation
        if (!form_data.key2.trim()) {
            new_errors.key2 = "Guardian key #2 is required.";
        } else if (form_data.key2.trim().length < 8) {
            new_errors.key2 = "Guardian key #2 must be at least 8 characters long.";
        }

        // Password validation
        if (!form_data.password) {
            new_errors.password = t.errors?.password_required || "Password is required.";
        } else if (form_data.password.length < 8) {
            new_errors.password = t.errors?.password_length || "Password must be at least 8 characters long.";
        }

        // Confirm password validation
        if (!form_data.confirm) {
            new_errors.confirm = "Please confirm your password.";
        } else if (form_data.password !== form_data.confirm) {
            new_errors.confirm = t.errors?.password_mismatch || "Passwords do not match.";
        }

        set_errors(new_errors);
        return Object.keys(new_errors).length === 0;
    };

    const handleInputChange = (field: keyof typeof form_data, value: string) => {
        set_form_data(prev => ({ ...prev, [field]: value }));
        
        // Clear specific field error when user starts typing
        if (errors[field]) {
            set_errors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        set_is_loading(true);
        set_errors({});
        set_success_message(null);

        try {
            const response = await guardianService.recover(
                form_data.email.trim(),
                form_data.key1.trim(),
                form_data.key2.trim(),
                form_data.password
            );

            if (response.status === 200) {
                set_success_message(t.recovery_success || "Account recovered successfully! You can now log in.");
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                // Handle API error response
                if (response.error) {
                    set_errors({ general: response.error });
                } else {
                    set_errors({ general: t.errors?.recovery_failed || "Recovery failed. Check your keys and try again." });
                }
            }
        } catch (error) {
            console.error("Recovery error:", error);
            set_errors({ general: t.errors?.recovery_failed || "Recovery failed. Check your keys and try again." });
        } finally {
            set_is_loading(false);
        }
    };

    return (
        <FormContainer>
            <h1 className="text-center text-primary fw-bold fs-3">{t.app_name}</h1>
            <h2 className="text-center mb-4 fw-semibold">{t.recovery_title}</h2>

            {success_message && (
                <Alert variant="success" className="mb-3">
                    <small>{success_message}</small>
                </Alert>
            )}

            {errors.general && (
                <Alert variant="danger" dismissible onClose={() => set_errors({ ...errors, general: undefined })} className="mb-3">
                    <small>{errors.general}</small>
                </Alert>
            )}

            <Form noValidate onSubmit={handleSubmit}>
                <InputText 
                    id="formEmail" 
                    label={t.recovery_email_label} 
                    hint={t.recovery_email_hint} 
                    error={errors.email}
                    value={form_data.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                />

                <InputText 
                    id="formKey1" 
                    label={t.recovery_key1_label} 
                    hint={t.recovery_key1_hint} 
                    error={errors.key1}
                    value={form_data.key1}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('key1', e.target.value)}
                />

                <InputText 
                    id="formKey2" 
                    label={t.recovery_key2_label} 
                    hint={t.recovery_key2_hint} 
                    error={errors.key2}
                    value={form_data.key2}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('key2', e.target.value)}
                />

                <InputPassword
                    id="formPassword"
                    label={t.recovery_new_password}
                    hint={t.password_hint}
                    error={errors.password}
                    showPassword={show_password}
                    setShowPassword={set_show_password}
                    value={form_data.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                />

                <InputPassword
                    id="formConfirm"
                    label={t.confirm_password}
                    hint={t.confirm_hint}
                    error={errors.confirm}
                    showPassword={show_confirm}
                    setShowPassword={set_show_confirm}
                    value={form_data.confirm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirm', e.target.value)}
                />

                <div className="d-grid mt-3">
                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="rounded-3 fw-semibold btn-sm"
                        disabled={is_loading}
                    >
                        {is_loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {t.recovery_loading}
                            </>
                        ) : (
                            t.recovery_action
                        )}
                    </Button>
                </div>
            </Form>

            <div className="text-center mt-3">
                <Link to="/" className="text-primary text-decoration-underline small">
                    {t.back_to_login}
                </Link>
            </div>

            <div className="text-center mt-4">
                <small
                    className="text-light"
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={toggleLang}
                >
                    {lang === "fr" ? "FR | EN" : "EN | FR"}
                </small>
            </div>
        </FormContainer>
    );
}

export default Recovery;
