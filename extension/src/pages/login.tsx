import { useState, useEffect } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { locales } from "../locales";
import type { LocaleKey } from "../locales";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [lang, setLang] = useState<LocaleKey>("fr");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    // ✅ Charger la langue depuis localStorage
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

    // ✅ Basculer la langue
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

        if (!email) newErrors.email = t.errors.email_required;
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t.errors.email_invalid;

        if (!password) newErrors.password = t.errors.password_required;
        else if (password.length < 8) newErrors.password = t.errors.password_length;

        setErrors(newErrors);
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-dark text-light vh-100 w-100 p-3">
            <div className="w-100" style={{ maxWidth: "360px" }}>
                {/* App title */}
                <h1 className="text-center mb-1 text-primary fw-bold fs-3">{t.app_name}</h1>
                {/* Page title */}
                <h2 className="text-center mb-4 fw-semibold">{t.login_title}</h2>

                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label className="fw-semibold small">{t.email}</Form.Label>
                        <Form.Control
                            type="email"
                            className={`form-control-sm bg-dark text-light border-secondary ${
                                errors.email ? "is-invalid" : ""
                            }`}
                        />
                        {errors.email ? (
                            <Form.Control.Feedback type="invalid" className="text-danger small">
                                {errors.email}
                            </Form.Control.Feedback>
                        ) : (
                            <Form.Text className="text-secondary small">{t.email_hint}</Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label className="fw-semibold small">{t.password}</Form.Label>
                        <InputGroup size="sm">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                className={`bg-dark text-light border-secondary rounded-start-3 ${
                                    errors.password ? "is-invalid" : ""
                                }`}
                            />
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="rounded-end-3 border-secondary"
                            >
                                {showPassword ? <EyeSlashFill /> : <EyeFill />}
                            </Button>
                        </InputGroup>
                        {errors.password ? (
                            <Form.Control.Feedback type="invalid" className="text-danger small d-block">
                                {errors.password}
                            </Form.Control.Feedback>
                        ) : (
                            <Form.Text className="text-secondary small">{t.password_hint}</Form.Text>
                        )}
                    </Form.Group>

                    <div className="d-grid">
                        <Button variant="primary" type="submit" className="rounded-3 fw-semibold btn-sm">
                            {t.login}
                        </Button>
                    </div>
                </Form>

                <div className="text-center mt-3">
                    <Link to="/signup" className="text-primary text-decoration-underline small">
                        {t.signup}
                    </Link>
                </div>

                <div className="text-center mt-3">
                    <small
                        className="text-secondary"
                        style={{ cursor: "pointer", userSelect: "none" }}
                        onClick={toggleLang}
                    >
                        {lang === "fr" ? "FR | EN" : "EN | FR"}
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Login;