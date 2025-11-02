import { useState } from "react";
import { EditPageLayout } from "../components/layout/EditPageLayout";
import { EditFormField } from "../components/forms/EditFormField";
import { ConfirmDeleteModal } from "../components/modals/ConfirmDeleteModal";
import { locales, type LocaleKey } from "../locales";
import { Form } from "react-bootstrap";

export function EditTrustedPage() {
    const [lang] = useState<LocaleKey>("fr");
    const t = locales[lang];

    const [fullname, setFullname] = useState("Camille Rondeau");
    const [email, setEmail] = useState("camille.rondeau@example.com");
    const [note, setNote] = useState("Camarade de confiance depuis 5 ans");
    const [showDelete, setShowDelete] = useState(false);

    const handleSave = () => {
        console.log("Personne de confiance modifiée :", { fullname, email, note });
    };

    const handleDelete = () => setShowDelete(true);
    const confirmDelete = () => {
        console.log("Personne de confiance supprimée :", fullname);
        setShowDelete(false);
    };

    return (
        <>
            <EditPageLayout
                title={fullname}
                subtitle={t.trusted.edit_subtitle}
                onSubmit={handleSave}
                onDelete={handleDelete}
                isEditing
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
                </Form.Group>
            </EditPageLayout>

            <ConfirmDeleteModal
                show={showDelete}
                onHide={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                itemName={fullname}
            />
        </>
    );
}