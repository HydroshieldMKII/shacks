import { useState } from "react";
import { EditPageLayout } from "../components/layout/EditPageLayout";
import { EditFormField } from "../components/forms/EditFormField";
import { locales, type LocaleKey } from "../locales";
import { Form } from "react-bootstrap";

export function AddPasswordPage() {
    const [lang] = useState<LocaleKey>("fr");
    const t = locales[lang];

    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [folder, setFolder] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = () => {
        console.log("Mot de passe ajouté :", {
            name,
            url,
            folder,
            username,
            password,
            note,
        });
    };

    return (
        <EditPageLayout
            title={t.passwords.add_title}
            subtitle={t.passwords.add_subtitle}
            onSubmit={handleSubmit}
            submitLabel={t.home.add_password}
        >
            <EditFormField label={t.username} value={name} onChange={setName} />
            <EditFormField label="Lien du site (URL)" value={url} onChange={setUrl} />

            <Form.Group className="mb-3">
                <Form.Label className="text-light fw-semibold">
                    Nom du dossier (optionnel)
                </Form.Label>
                <Form.Control
                    type="text"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="bg-dark text-light border-secondary"
                />
                <Form.Text className="text-secondary small">
                    Laissez vide si vous ne souhaitez pas classer ce mot de passe dans un dossier.
                </Form.Text>
            </Form.Group>

            <EditFormField label={t.email} value={username} onChange={setUsername} />
            <EditFormField label={t.password} type="password" value={password} onChange={setPassword} />

            <Form.Group className="mb-3">
                <Form.Label className="text-light fw-semibold">{t.note_label}</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-dark text-light border-secondary"
                />
                <Form.Text className="text-secondary small">{t.note_hint}</Form.Text>
            </Form.Group>
        </EditPageLayout>
    );
}