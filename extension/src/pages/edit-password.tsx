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
import { ArrowRepeat } from "react-bootstrap-icons";

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
    const [autoFilling, setAutoFilling] = useState(false);
    const [autoFillSuccess, setAutoFillSuccess] = useState(false);
    
    // Field-specific errors
    const [fieldErrors, setFieldErrors] = useState<{
        title?: string;
        username?: string;
        password?: string;
    }>({});

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
                        setError(passwordResult.error || t.home.error_load_password);
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

    const handleSave = async () => {
        if (!id || !validateFields()) {
            return;
        }

        setSaving(true);
        setError(null);
        setFieldErrors({});

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
                setError(result.error || t.home.error_update_password);
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
                setError(result.error || t.home.error_delete_password);
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

    const handleAutoFill = async () => {
        setAutoFilling(true);
        setAutoFillSuccess(false);
        setError(null);

        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.id) {
                setError("No active tab found");
                setAutoFilling(false);
                return;
            }

            // Try to inject content script if not already present
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                });
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (injectError) {
                // Continue anyway, script might already be there
            }

            // Send message to content script to fill the form
            chrome.tabs.sendMessage(tab.id, {
                action: 'fillForm',
                data: {
                    id: id,
                    name: title,
                    username: username,
                    password: password,
                    url: url
                }
            }, (response) => {
                if (chrome.runtime.lastError) {
                    setError(`Could not auto-fill: ${chrome.runtime.lastError.message}. Try reloading the page.`);
                } else if (response?.success) {
                    setAutoFillSuccess(true);
                    setTimeout(() => setAutoFillSuccess(false), 3000);
                } else {
                    setError("No login form found on this page. Make sure the page has loaded completely.");
                }
                setAutoFilling(false);
            });
        } catch (err) {
            setError(`Failed to auto-fill form`);
            setAutoFilling(false);
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
                    label={t.name} 
                    value={title} 
                    onChange={handleTitleChange} 
                    error={fieldErrors.title}
                    required
                />
            </div>

            <div className="mb-3">
                <EditFormField 
                    label={t.url} 
                    value={url} 
                    onChange={setUrl} 
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

            <div className="mb-3">
                <EditFormField 
                    label={t.username} 
                    value={username} 
                    onChange={handleUsernameChange} 
                    error={fieldErrors.username}
                    required
                />
            </div>

            <div className="mb-3">
                <EditFormField 
                    label={t.password} 
                    value={password} 
                    onChange={handlePasswordChange} 
                    type="password"
                    error={fieldErrors.password}
                    required
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

            <div className="d-flex flex-column gap-2">
                <button 
                    className={`btn ${autoFillSuccess ? 'btn-success' : 'btn-outline-primary'} d-flex align-items-center justify-content-center gap-2`}
                    onClick={handleAutoFill}
                    disabled={autoFilling}
                    style={{ transition: 'all 0.3s' }}
                >
                    <ArrowRepeat size={18} className={autoFilling ? 'rotating' : ''} />
                    {autoFilling ? "Auto-filling..." : autoFillSuccess ? "✓ Filled!" : "Auto-fill on current page"}
                </button>

                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-primary flex-grow-1"
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
            </div>

            <style>{`
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .rotating {
                    animation: rotate 1s linear infinite;
                }
            `}</style>

            <ConfirmDeleteModal 
                show={showDelete}
                onHide={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                itemName={title}
            />
        </FormContainer>
    );
}