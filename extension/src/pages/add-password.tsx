import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormContainer } from "../components/forms/FormContainer";
import { EditFormField } from "../components/forms/EditFormField";
import { locales, type LocaleKey } from "../locales";
import passwordService from "../services/passwordService";
import folderService from "../services/folderService";
import { ApiResponseModel } from "../services/apiService";
import { FolderModel } from "../models/folder.model";

export function AddPasswordPage() {
    const [lang] = useState<LocaleKey>("fr");
    const t = locales[lang];
    const navigate = useNavigate();

    const [title, setTitle] = useState(""); // Changed from 'name' to 'title' to match service
    const [url, setUrl] = useState("");
    const [folderName, setFolderName] = useState(""); // Changed to folder name instead of ID
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [notes, setNotes] = useState(""); // Changed from 'note' to 'notes' to match service
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingFolders, setExistingFolders] = useState<FolderModel[]>([]);
    
    // Field-specific errors
    const [fieldErrors, setFieldErrors] = useState<{
        title?: string;
        username?: string;
        password?: string;
    }>({});

    // Load existing folders on component mount
    useEffect(() => {
        const loadFolders = async () => {
            try {
                const result = await passwordService.getPasswords();
                if (result instanceof ApiResponseModel) {
                    console.error("Failed to load folders:", result.error);
                } else {
                    setExistingFolders(result);
                }
            } catch (err) {
                console.error("Error loading folders:", err);
            }
        };

        loadFolders();
    }, []);

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
                throw new Error(result.error || t.home.error_create_folder);
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

    const validateFields = () => {
        const errors: { title?: string; username?: string; password?: string } = {};
        
        if (!title.trim()) {
            errors.title = t.errors.title_required;
        }
        if (!username.trim()) {
            errors.username = t.errors.username_required;
        }
        if (!password.trim()) {
            errors.password = t.errors.password_required;
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Clear field error when user starts typing
    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (fieldErrors.title) {
            setFieldErrors(prev => ({ ...prev, title: undefined }));
        }
    };

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        if (fieldErrors.username) {
            setFieldErrors(prev => ({ ...prev, username: undefined }));
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (fieldErrors.password) {
            setFieldErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            return;
        }

        setLoading(true);
        setError(null);
        setFieldErrors({});

        try {
            // Get or create folder ID from folder name
            let folderId: number | undefined;
            if (folderName.trim()) {
                const folderIdResult = await getOrCreateFolderByName(folderName);
                folderId = folderIdResult || undefined;
            }

            const result = await passwordService.createPassword(
                title,
                username, 
                password,
                url,
                notes || undefined,
                folderId || undefined
            );

            if (result instanceof ApiResponseModel) {
                // Error response
                setError(result.error || t.home.error_create_password);
            } else {
                // Success - navigate back to home
                navigate("/home");
            }
        } catch (err) {
            console.error("Error creating password:", err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer title={t.passwords.add_title} showBackButton>
            {error && (
                <div className="alert alert-danger mb-3">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <EditFormField 
                    label={t.password_title} 
                    value={title} 
                    onChange={handleTitleChange}
                    placeholder="e.g., YouTube Account"
                    error={fieldErrors.title}
                    required
                />
            </div>
            
            <div className="mb-3">
                <EditFormField 
                    label={t.website_url_optional} 
                    value={url} 
                    onChange={setUrl}
                    placeholder="e.g., https://youtube.com"
                />
            </div>

            <div className="mb-3">
                <EditFormField 
                    label={t.username_email} 
                    value={username} 
                    onChange={handleUsernameChange}
                    placeholder="e.g., john.doe@email.com"
                    error={fieldErrors.username}
                    required
                />
            </div>
            
            <div className="mb-3">
                <EditFormField 
                    label={t.password} 
                    type="password" 
                    value={password} 
                    onChange={handlePasswordChange}
                    placeholder="Enter password"
                    error={fieldErrors.password}
                    required
                />
            </div>

            <div className="mb-3">
                <div className="mb-2">
                    <label className="form-label text-light">{t.folder_name_optional}</label>
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
                    {t.folder_name_hint}
                </div>
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
                    onClick={handleSubmit} 
                    disabled={loading}
                >
                    {loading ? t.actions.adding : t.home.add_password}
                </button>
            </div>
        </FormContainer>
    );
}