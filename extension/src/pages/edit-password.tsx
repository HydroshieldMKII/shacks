import { useState } from "react";
import { EditPageLayout } from "../components/layout/EditPageLayout";
import { EditFormField } from "../components/forms/EditFormField";
import { ConfirmDeleteModal } from "../components/modals/ConfirmDeleteModal";
import { locales, type LocaleKey } from "../locales";
import { Form } from "react-bootstrap";

export function EditPasswordPage() {
    const [lang] = useState<LocaleKey>("fr");
    const t = locales[lang];

    const [name, setName] = useState("YouTube personnel");
    const [url, setUrl] = useState("https://www.youtube.com");
    const [folder, setFolder] = useState("Comptes personnels");
    const [username, setUsername] = useState("a_lexterieur");
    const [password, setPassword] = useState("motdepasse123");
    const [note, setNote] = useState("J’aime jouer dehors");
    const [showDelete, setShowDelete] = useState(false);

    const handleSave = () => {
        console.log("Mot de passe modifié :", { name, url, folder, username, password, note });
    };

    const handleDelete = () => setShowDelete(true);
    const confirmDelete = () => {
        console.log("Mot de passe supprimé :", name);
        setShowDelete(false);
    };

    return (
        <>
            <EditPageLayout
                title={name}
                subtitle={t.passwords.edit_subtitle}
                onSubmit={handleSave}
                onDelete={handleDelete}
                isEditing
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
                </Form.Group>
            </EditPageLayout>

            <ConfirmDeleteModal
                show={showDelete}
                onHide={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                itemName={name}
            />
        </>
    );
}