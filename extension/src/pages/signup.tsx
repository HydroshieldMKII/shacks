import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { locales } from "../locales";
import type { LocaleKey } from "../locales";
import { FormContainer } from "../components/form/FormContainer";
import { InputText } from "../components/inputs/InputText";
import { InputPassword } from "../components/inputs/InputPassword";

function Signup() {
    const [lang, set_lang] = useState<LocaleKey>("fr");
    const [show_password, set_show_password] = useState(false);
    const [show_confirm, set_show_confirm] = useState(false);
    const [errors, set_errors] = useState<{ email?: string; password?: string; confirm?: string }>({});

    useEffect(() => {
        const user_lang = navigator.language.startsWith("fr") ? "fr" : "en";
        set_lang(user_lang as LocaleKey);
    }, []);

    const t = locales[lang];

    const handle_submit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const new_errors: typeof errors = {};

        const email_value = form.formEmail.value.trim();
        const password_value = form.formPassword.value.trim();
        const confirm_value = form.formConfirm.value.trim();

        if (!email_value) new_errors.email = t.errors.email_required;
        else if (!/\S+@\S+\.\S+/.test(email_value)) new_errors.email = t.errors.email_invalid;

        if (!password_value) new_errors.password = t.errors.password_required;
        else if (password_value.length < 8) new_errors.password = t.errors.password_length;

        if (confirm_value !== password_value) new_errors.confirm = t.errors.password_mismatch;

        set_errors(new_errors);
    };

    return (
        <FormContainer>
            {/* 🔹 App title — en gros, avec marge haut/bas */}
            <h1 className="text-center text-success fw-bold fs-3">TRUST</h1>

            {/* 🔹 Page title */}
            <h2 className="text-center mb-4 fw-semibold">{t.signup_title}</h2>

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
                    <Button variant="primary" type="submit" className="rounded-3 fw-semibold btn-sm">
                        {t.signup_action ?? "S’inscrire"}
                    </Button>
                </div>
            </Form>

            <div className="text-center mt-3">
                <Link to="/" className="text-primary text-decoration-underline small">
                    {t.back_to_login ?? "Déjà un compte ? Connectez-vous !"}
                </Link>
            </div>

            <div className="text-center mt-4">
                <small
                    className="text-secondary"
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => set_lang(lang === "fr" ? "en" : "fr")}
                >
                    {lang === "fr" ? "FR | EN" : "EN | FR"}
                </small>
            </div>
        </FormContainer>
    );
}

export default Signup;