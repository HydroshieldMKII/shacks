import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { locales } from "../locales";
import type { LocaleKey } from "../locales";
import { InputEmail } from "../components/inputs/InputEmail";
import { InputPassword } from "../components/inputs/InputPassword";
import { SubmitButton } from "../components/buttons/SubmitButton";
import { LangSwitch } from "../components/misc/LangSwitch";
import { FormContainer } from "../components/layout/FormContainer";

function Login() {
    const [lang, set_lang] = useState<LocaleKey>("fr");
    const [errors, set_errors] = useState<{ email?: string; password?: string }>({});

    useEffect(() => {
        const user_lang = navigator.language.startsWith("fr") ? "fr" : "en";
        set_lang(user_lang as LocaleKey);
    }, []);

    const t = locales[lang];

    const handle_submit = (e: React.FormEvent) => {
        e.preventDefault();
        const new_errors: { email?: string; password?: string } = {};

        const form = e.target as HTMLFormElement;
        const email_value = form.formEmail.value.trim();
        const password_value = form.formPassword.value.trim();

        if (!email_value)
            new_errors.email = lang === "fr" ? "Veuillez entrer un courriel." : "Please enter an email.";
        else if (!/\S+@\S+\.\S+/.test(email_value))
            new_errors.email = lang === "fr" ? "Adresse courriel invalide." : "Invalid email address.";

        if (!password_value)
            new_errors.password = lang === "fr" ? "Veuillez entrer un mot de passe." : "Please enter a password.";
        else if (password_value.length < 8)
            new_errors.password =
                lang === "fr"
                    ? "Le mot de passe doit contenir au moins 8 caractères."
                    : "Password must be at least 8 characters long.";

        set_errors(new_errors);
    };

    return (
        <FormContainer title={t.title}>
            <Form noValidate onSubmit={handle_submit}>
                <InputEmail label={t.email} hint={t.email_hint} error={errors.email} />
                <InputPassword label={t.password} hint={t.password_hint} error={errors.password} />
                <SubmitButton label={t.login} />
            </Form>

            <div className="text-center mt-3">
                <a href="#" className="text-primary text-decoration-underline small">
                    {t.signup}
                </a>
            </div>

            <LangSwitch lang={lang} on_toggle={() => set_lang(lang === "fr" ? "en" : "fr")} />
        </FormContainer>
    );
}

export default Login;
