import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { locales } from "../locales";
import type { LocaleKey } from "../locales";
import { FormContainer } from "../components/form/FormContainer";
import { InputText } from "../components/inputs/InputText";
import { InputPassword } from "../components/inputs/InputPassword";

function Signup() {
    const [lang, setLang] = useState<LocaleKey>("fr");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

    // ✅ Charger la langue persistée
    useEffect(() => {
        const storedLang = localStorage.getItem("trust_lang");
        if (storedLang === "fr" || storedLang === "en") {
            setLang(storedLang);
        } else {
            const userLang = navigator.language.startsWith("fr") ? "fr" : "en";
            setLang(userLang as LocaleKey);
            localStorage.setItem("trust_lang", userLang);
        }
    }, []);

    const toggleLang = () => {
        const newLang = lang === "fr" ? "en" : "fr";
        setLang(newLang);
        localStorage.setItem("trust_lang", newLang);
    };

    const t = locales[lang];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const newErrors: typeof errors = {};

        const email = form.formEmail.value.trim();
        const password = form.formPassword.value.trim();
        const confirm = form.formConfirm.value.trim();

        if (!email) newErrors.email = t.errors.email_required;
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t.errors.email_invalid;

        if (!password) newErrors.password = t.errors.password_required;
        else if (password.length < 8) newErrors.password = t.errors.password_length;

        if (confirm !== password) newErrors.confirm = t.errors.password_mismatch;

        setErrors(newErrors);
    };

    return (
        <FormContainer>
            <h1 className="text-center text-primary fw-bold fs-3">{t.app_name}</h1>
            <h2 className="text-center mb-4 fw-semibold">{t.signup_title}</h2>

            <Form noValidate onSubmit={handleSubmit}>
                <InputText id="formEmail" label={t.email} hint={t.email_hint} error={errors.email} />

                <InputPassword
                    id="formPassword"
                    label={t.password}
                    hint={t.password_hint}
                    error={errors.password}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />

                <InputPassword
                    id="formConfirm"
                    label={t.confirm_password}
                    hint={t.confirm_hint}
                    error={errors.confirm}
                    showPassword={showConfirm}
                    setShowPassword={setShowConfirm}
                />

                <div className="d-grid mt-3">
                    <Button variant="primary" type="submit" className="rounded-3 fw-semibold btn-sm">
                        {t.signup_action}
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