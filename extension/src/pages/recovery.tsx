import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { locales } from "../locales";
import type { LocaleKey } from "../locales";
import { FormContainer } from "../components/form/FormContainer";
import { InputText } from "../components/inputs/InputText";
import { InputPassword } from "../components/inputs/InputPassword";

function Recovery() {
    const [lang, set_lang] = useState<LocaleKey>("fr");
    const [show_password, set_show_password] = useState(false);
    const [show_confirm, set_show_confirm] = useState(false);
    const [errors, set_errors] = useState<{ 
        email?: string; 
        key1?: string; 
        key2?: string; 
        password?: string; 
        confirm?: string; 
        general?: string 
    }>({});
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
    }, []);

    const toggleLang = () => {
        const newLang = lang === "fr" ? "en" : "fr";
        set_lang(newLang);
        localStorage.setItem("trust_lang", newLang);
    };

    const t = locales[lang];


    return (
        <FormContainer>
            <h1 className="text-center text-primary fw-bold fs-3">{t.app_name}</h1>
            <h2 className="text-center mb-4 fw-semibold">{t.recovery_title}</h2>

            {errors.general && (
                <Alert variant="danger" dismissible onClose={() => set_errors({ ...errors, general: undefined })} className="mb-3">
                    <small>{errors.general}</small>
                </Alert>
            )}

            <Form noValidate>
                <InputText 
                    id="formEmail" 
                    label={t.recovery_email_label} 
                    hint={t.recovery_email_hint} 
                    error={errors.email} 
                />

                <InputText 
                    id="formKey1" 
                    label={t.recovery_key1_label} 
                    hint={t.recovery_key1_hint} 
                    error={errors.key1} 
                />

                <InputText 
                    id="formKey2" 
                    label={t.recovery_key2_label} 
                    hint={t.recovery_key2_hint} 
                    error={errors.key2} 
                />

                <InputPassword
                    id="formPassword"
                    label={t.recovery_new_password}
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

export default Recovery;
