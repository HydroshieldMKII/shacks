import { useState } from "react";
import { EditPageLayout } from "../components/layout/EditPageLayout";
import { EditFormField } from "../components/forms/EditFormField";
import { locales, type LocaleKey } from "../locales";
import { Form } from "react-bootstrap";

export function AddTrustedPage() {
    const [lang] = useState<LocaleKey>("fr");
    const t = locales[lang];

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = () => {
        console.log("Personne de confiance ajoutée :", { fullname, email, note });
    };

    return (
        <EditPageLayout
            title={t.trusted.add_title}
            subtitle={t.trusted.add_subtitle}
            onSubmit={handleSubmit}
            submitLabel={t.home.add_person}
        >
            <EditFormField label={t.username} value={fullname} onChange={setFullname} />
            <EditFormField label={t.email} value={email} onChange={setEmail} />

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