import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormContainer } from "../components/forms/FormContainer";
import { EditFormField } from "../components/forms/EditFormField";
import { ConfirmDeleteModal } from "../components/modals/ConfirmDeleteModal";
import { locales, type LocaleKey } from "../locales";
import guardianService from "../services/guardianService";
import { ApiResponseModel } from "../services/apiService";

export function EditTrustedPage() {
    const [lang] = useState<LocaleKey>("fr");
    const t = locales[lang];
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGuardian = async () => {
            if (!id) {
                setError("Guardian ID is required");
                setLoading(false);
                return;
            }

            try {
                const result = await guardianService.getGuardians();
                
                if (result instanceof ApiResponseModel) {
                    setError(result.error || t.home.error_load_trusted);
                } else {
                    // Find the guardian by ID from both protecting and protected lists
                    const allGuardians = [...result.protecting, ...result.protected];
                    const guardian = allGuardians.find(g => g.id === parseInt(id));
                    
                    if (guardian) {
                        setEmail(guardian.guardedEmail);
                    } else {
                        setError("Trusted person not found");
                    }
                }
            } catch (err) {
                console.error("Error loading guardian:", err);
                setError("Failed to load trusted person");
            } finally {
                setLoading(false);
            }
        };

        loadGuardian();
    }, [id]);

    const handleSave = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // For guardians, we need to remove the old one and create a new one with the new email
            // This is a limitation of the current API
            const result = await guardianService.createGuardian(email);

            if (result instanceof ApiResponseModel) {
                setError(result.error || t.home.error_update_trusted);
            } else {
                navigate("/home");
            }
        } catch (err) {
            console.error("Error updating guardian:", err);
            setError("Failed to update trusted person");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => setShowDelete(true);
    
    const confirmDelete = async () => {
        if (!id) return;

        try {
            const result = await guardianService.removeGuardian(parseInt(id));
            
            if (result.status !== 200) {
                setError(result.error || t.home.error_delete_trusted);
            } else {
                navigate("/home");
            }
        } catch (err) {
            console.error("Error deleting guardian:", err);
            setError("Failed to delete trusted person");
        } finally {
            setShowDelete(false);
        }
    };

    if (loading) {
        return (
            <FormContainer title={t.trusted.edit_subtitle} showBackButton>
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
            <FormContainer title={t.trusted.edit_subtitle} showBackButton>
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </FormContainer>
        );
    }

    return (
        <FormContainer title={t.trusted.edit_subtitle} showBackButton>
            <div className="mb-3">
                <EditFormField 
                    label={t.email} 
                    value={email} 
                    onChange={setEmail} 
                    type="email"
                />
            </div>

            <div className="d-flex gap-2">
                <button 
                    className="btn btn-primary"
                    onClick={handleSave} 
                    disabled={saving}
                >
                    {saving ? t.actions.saving : t.actions.save}
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
                itemName={email}
            />
        </FormContainer>
    );
}