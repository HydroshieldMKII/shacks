import { useState, useEffect } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { locales } from "../locales";
import type { LocaleKey } from "../locales";
import authService from "../services/authService";
import apiService from "../services/apiService";
import { UserModel } from "../models/user.model";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [lang, setLang] = useState<LocaleKey>("fr");
    const [errors, set_errors] = useState<{ username?: string; password?: string; general?: string }>({});
    const [is_loading, set_is_loading] = useState(false);
    const [apiDomain, setApiDomain] = useState<string>("");
    const [domainSaved, setDomainSaved] = useState<string | null>(null);
    const navigate = useNavigate();

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
        checkAuthentication();
        // Load persisted API domain for the domain input
        try {
            const current = apiService.getBaseUrl();
            setApiDomain(current);
        } catch (e) {
            const stored = localStorage.getItem('trust_api_domain');
            if (stored) setApiDomain(stored);
        }
    }, []);

    const checkAuthentication = async () => {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
            navigate('/home');
        }
    };

    const toggleLang = () => {
        const newLang = lang === "fr" ? "en" : "fr";
        setLang(newLang);
        localStorage.setItem("trust_lang", newLang);
    };

    const t = locales[lang];

    const handle_submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const new_errors: { username?: string; password?: string; general?: string } = {};

        const form = e.target as HTMLFormElement;
        const username_value = form.formUsername.value.trim();
        const password_value = form.formPassword.value.trim();

        if (!username_value) {
            new_errors.username = t.errors.username_required;
        }

        if (!password_value) new_errors.password = t.errors.password_required;
        else if (password_value.length < 8) new_errors.password = t.errors.password_length;

        // If there are validation errors, don't proceed
        if (Object.keys(new_errors).length > 0) {
            set_errors(new_errors);
            return;
        }

        // Clear errors and start loading
        set_errors({});
        set_is_loading(true);

        try {
            const result = await authService.login(username_value, password_value);
            
            if (result instanceof UserModel) {
                // Login successful, navigate to home
                navigate('/home');
            } else {
                // Login failed, show error
                set_errors({ general: result.error || t.home.login_failed });
            }
        } catch (error) {
            set_errors({ general: t.unexpected_error });
        } finally {
            set_is_loading(false);
        }
    };

    const saveApiDomain = () => {
        try {
            if (!apiDomain || !apiDomain.trim()) {
                setDomainSaved('Invalid URL');
                return;
            }

            // Let apiService normalize and persist the URL
            apiService.setBaseUrl(apiDomain);
            setApiDomain(apiService.getBaseUrl());
            setDomainSaved('Saved');

            // hide the message after a short delay
            setTimeout(() => setDomainSaved(null), 2000);
        } catch (error) {
            setDomainSaved('Failed to save');
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-dark text-light vh-100 w-100 p-3">
            <div className="w-100" style={{ maxWidth: "360px" }}>
                {/* App title */}
                <h1 className="text-center mb-1 text-primary fw-bold fs-3">{t.app_name}</h1>
                {/* Page title */}
                <h2 className="text-center mb-4 fw-semibold">{t.login_title}</h2>

                {errors.general && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <small>{errors.general}</small>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => set_errors({ ...errors, general: undefined })}
                            aria-label="Close"
                        ></button>
                    </div>
                )}

                <Form noValidate onSubmit={handle_submit}>
                    <Form.Group className="mb-3" controlId="formApiDomain">
                        <Form.Label className="fw-semibold small">API Domain</Form.Label>
                        <InputGroup size="sm">
                            <Form.Control
                                type="text"
                                value={apiDomain}
                                onChange={(e) => setApiDomain(e.target.value)}
                                className="form-control-sm bg-dark text-light border-secondary"
                            />
                            <Button variant="outline-secondary" type="button" onClick={saveApiDomain} className="rounded-end-3 border-secondary">
                                Save
                            </Button>
                        </InputGroup>
                        <Form.Text className="text-light small">Change the API domain your extension uses. Example: https://api.trust.example/</Form.Text>
                        {domainSaved && <div className="text-success small mt-1">{domainSaved}</div>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label className="fw-semibold small">{t.username}</Form.Label>
                        <Form.Control
                            type="text"
                            className={`form-control-sm bg-dark text-light border-secondary ${
                                errors.username ? "is-invalid" : ""
                            }`}
                        />
                        {errors.username ? (
                            <Form.Control.Feedback type="invalid" className="text-danger small">
                                {errors.username}
                            </Form.Control.Feedback>
                        ) : (
                            <Form.Text className="text-light small">{t.username_hint}</Form.Text>
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
                            <Form.Text className="text-light small">{t.password_hint}</Form.Text>
                        )}
                    </Form.Group>

                    <div className="d-grid">
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="rounded-3 fw-semibold btn-sm"
                            disabled={is_loading}
                        >
                            {is_loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {t.login_loading}
                                </>
                            ) : (
                                t.login
                            )}
                        </Button>
                    </div>
                </Form>

                <div className="text-center mt-3">
                    <Link to="/signup" className="text-primary text-decoration-underline small">
                        {t.signup}
                    </Link>
                </div>

                <div className="text-center mt-2">
                    <Link to="/recovery" className="text-primary text-decoration-underline small">
                        {t.recover_account}
                    </Link>
                </div>

                <div className="text-center mt-3">
                    <small
                        className="text-light"
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