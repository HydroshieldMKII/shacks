import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { locales } from "../locales";
import type { LocaleKey } from "../locales";
import { FormContainer } from "../components/form/FormContainer";
import { InputText } from "../components/inputs/InputText";
import { InputPassword } from "../components/inputs/InputPassword";
import authService from "../services/authService";
import { UserModel } from "../models/user.model";

function Signup() {
    const [lang, set_lang] = useState<LocaleKey>("fr");
    const [show_password, set_show_password] = useState(false);
    const [show_confirm, set_show_confirm] = useState(false);
    const [errors, set_errors] = useState<{ email?: string; password?: string; confirm?: string; general?: string }>({});
    const [is_loading, set_is_loading] = useState(false);
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
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
            navigate('/home');
        }
    };

    const toggleLang = () => {
        const newLang = lang === "fr" ? "en" : "fr";
        set_lang(newLang);
        localStorage.setItem("trust_lang", newLang);
    };

    const t = locales[lang];

    const handle_submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const newErrors: typeof errors = {};

        const email = form.formEmail.value.trim();
        const password = form.formPassword.value.trim();
        const confirm = form.formConfirm.value.trim();

        // Validate email
        if (!email) newErrors.email = t.errors.email_required;
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t.errors.email_invalid;

        // Validate password
        if (!password) newErrors.password = t.errors.password_required;
        else if (password.length < 8) newErrors.password = t.errors.password_length;

        // Validate password confirmation
        if (confirm !== password) newErrors.confirm = t.errors.password_mismatch;

        // If there are validation errors, don't proceed
        if (Object.keys(newErrors).length > 0) {
            set_errors(newErrors);
            return;
        }

        // Clear errors and start loading
        set_errors({});
        set_is_loading(true);

        try {
            // Use email as username for signup (you might want to adjust this based on your backend requirements)
            const result = await authService.signup(email, password);
            
            if (result instanceof UserModel) {
                // Signup successful, navigate to home
                navigate('/home');
            } else {
                // Signup failed, show error
                set_errors({ general: result.error || 'Signup failed. Please try again.' });
            }
        } catch (error) {
            set_errors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            set_is_loading(false);
        }
    };

    return (
        <FormContainer>
            <h1 className="text-center text-primary fw-bold fs-3">{t.app_name}</h1>
            <h2 className="text-center mb-4 fw-semibold">{t.signup_title}</h2>

            {errors.general && (
                <Alert variant="danger" dismissible onClose={() => set_errors({ ...errors, general: undefined })} className="mb-3">
                    <small>{errors.general}</small>
                </Alert>
            )}

            <Form noValidate onSubmit={handle_submit}>
                <InputText id="formEmail" label={t.email} hint={t.email_hint} error={errors.email} />

                <InputPassword
                    id="formPassword"
                    label={t.password}
                    hint={t.password_hint}
                    error={errors.password}
                    showPassword={show_password}
                    setShowPassword={set_show_password}
                />

                <InputPassword
                    id="formConfirm"
                    label={t.confirm_password}
                    hint={t.confirm_hint}
                    error={errors.confirm}
                    showPassword={show_confirm}
                    setShowPassword={set_show_confirm}
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
                                {t.signup_loading}
                            </>
                        ) : (
                            t.signup_action
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
                    className="text-secondary"
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={toggleLang}
                >
                    {lang === "fr" ? "FR | EN" : "EN | FR"}
                </small>
            </div>
        </FormContainer>
    );
}

export default Signup;