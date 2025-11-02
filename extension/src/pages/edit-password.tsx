import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormContainer } from "../components/forms/FormContainer";
import { EditFormField } from "../components/forms/EditFormField";
import { ConfirmDeleteModal } from "../components/modals/ConfirmDeleteModal";
import { locales, type LocaleKey } from "../locales";
import passwordService from "../services/passwordService";
import folderService from "../services/folderService";
import { ApiResponseModel } from "../services/apiService";
import { FolderModel } from "../models/folder.model";

export function EditPasswordPage() {
    const [lang] = useState<LocaleKey>("fr");
    const t = locales[lang];
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [folderName, setFolderName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [notes, setNotes] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingFolders, setExistingFolders] = useState<FolderModel[]>([]);

    // Load existing folders and password data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load existing folders
                const foldersResult = await passwordService.getPasswords();
                if (!(foldersResult instanceof ApiResponseModel)) {
                    setExistingFolders(foldersResult);
                }

                // Load password data if ID is provided
                if (id) {
                    const passwordResult = await passwordService.getPassword(parseInt(id));
                    
                    if (passwordResult instanceof ApiResponseModel) {
                        setError(passwordResult.error || "Failed to load password");
                    } else {
                        // PasswordModel
                        setTitle(passwordResult.name);
                        setUrl(passwordResult.url || "");
                        setUsername(passwordResult.username);
                        setPassword(passwordResult.password);
                        setNotes(passwordResult.notes || "");

                        
                        // Set folder name if password has a folder
                        if (passwordResult.folderId) {
                            const folder = foldersResult instanceof ApiResponseModel ? 
                                null : foldersResult.find(f => f.id === passwordResult.folderId);
                            setFolderName(folder?.name || "");
                        }
                    }
                } else {
                    setError("Password ID is required");
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load password data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    // Helper function to get or create folder by name
    const getOrCreateFolderByName = async (name: string): Promise<number | null> => {
        if (!name.trim()) return null;
        
        // Check if folder already exists
        const existingFolder = existingFolders.find(folder => 
            folder.name.toLowerCase() === name.toLowerCase()
        );
        
        if (existingFolder) {
            return existingFolder.id;
        }
        
        // Create new folder
        try {
            const result = await folderService.createFolder(name.trim());
            if (result instanceof ApiResponseModel) {
                throw new Error(result.error || "Failed to create folder");
            } else {
                // Add to existing folders list for future reference
                setExistingFolders(prev => [...prev, result]);
                return result.id;
            }
        } catch (err) {
            console.error("Error creating folder:", err);
            throw err;
        }
    };

    const handleSave = async () => {
        if (!id || !title || !username || !password) {
            setError("All required fields must be filled");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // Get or create folder ID from folder name
            let folderId: number | undefined;
            if (folderName.trim()) {
                const folderIdResult = await getOrCreateFolderByName(folderName);
                folderId = folderIdResult || undefined;
            } else {
                // Explicitly set to undefined to clear the folder
                folderId = undefined;
            }

            const result = await passwordService.updatePassword(
                parseInt(id),
                title,
                username,
                password,
                url,
                notes || undefined,
                folderId
            );

            if (result instanceof ApiResponseModel) {
                setError(result.error || "Failed to update password");
            } else {
                navigate("/home");
            }
        } catch (err) {
            console.error("Error updating password:", err);
            setError("Failed to update password");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => setShowDelete(true);
    
    const confirmDelete = async () => {
        if (!id) return;

        try {
            const result = await passwordService.deletePassword(parseInt(id));
            
            if (result instanceof ApiResponseModel) {
                setError(result.error || "Failed to delete password");
            } else {
                navigate("/home");
            }
        } catch (err) {
            console.error("Error deleting password:", err);
            setError("Failed to delete password");
        } finally {
            setShowDelete(false);
        }
    };

    if (loading) {
        return (
            <FormContainer title={t.passwords.edit_subtitle} showBackButton>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </FormContainer>
        );
    }

    if (error) {
        return (
            <FormContainer title={t.passwords.edit_subtitle} showBackButton>
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </FormContainer>
        );
    }

    return (
        <FormContainer title={t.passwords.edit_subtitle} showBackButton>
            <div className="mb-3">
                <EditFormField 
                    label="Name" 
                    value={title} 
                    onChange={setTitle} 
                />
            </div>

            <div className="mb-3">
                <EditFormField 
                    label="URL" 
                    value={url} 
                    onChange={setUrl} 
                />
            </div>

            <div className="mb-3">
                <div className="mb-2">
                    <label className="form-label text-light">Folder Name (optional)</label>
                </div>
                <input
                    className="form-control bg-dark text-light border-secondary"
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="e.g., Personal, Work, Shopping..."
                    list="folder-suggestions"
                />
                <datalist id="folder-suggestions">
                    {existingFolders.map(folder => (
                        <option key={folder.id} value={folder.name} />
                    ))}
                </datalist>
                <div className="form-text text-light small">
                    Enter folder name to organize this password. Will create folder if it doesn't exist.
                </div>
            </div>

            <div className="mb-3">
                <EditFormField 
                    label={t.username} 
                    value={username} 
                    onChange={setUsername} 
                />
            </div>

            <div className="mb-3">
                <EditFormField 
                    label={t.password} 
                    value={password} 
                    onChange={setPassword} 
                    type="password"
                />
            </div>

            <div className="mb-4">
                <textarea
                    className="form-control bg-dark text-light border-secondary"
                    placeholder={t.note_hint}
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <div className="d-flex gap-2">
                <button 
                    className="btn btn-primary"
                    onClick={handleSave} 
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save"}
                </button>
                <button 
                    className="btn btn-danger"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>

            <ConfirmDeleteModal 
                show={showDelete}
                onHide={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                itemName={title}
            />
        </FormContainer>
    );
}