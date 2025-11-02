import { Button, Spinner, Alert } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import { FolderElement } from "../elements/FolderElement";
import { TrustedElement } from "../elements/TrustedElement";
import { GuardianModel } from "../../models/guardian.model";
import guardianService from "../../services/guardianService";
import authService from "../../services/authService";
import { ApiResponseModel } from "../../services/apiService";

interface TrustedSectionProps {
    t: {
        add_trusted: string;
        loading?: string;
        no_trusted_found?: string;
        error_loading_trusted?: string;
        login_required?: string;
    };
}

export function TrustedSection({ t }: TrustedSectionProps) {
    const [protectingGuardians, setProtectingGuardians] = useState<GuardianModel[]>([]);
    const [protectedGuardians, setProtectedGuardians] = useState<GuardianModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthAndLoadGuardians = async () => {
            try {
                const authenticated = await authService.isAuthenticated();
                setIsAuthenticated(authenticated);

                if (!authenticated) {
                    setError(t.login_required || "Please log in to view trusted contacts.");
                    setLoading(false);
                    return;
                }

                const response = await guardianService.getGuardians();
                
                if (response instanceof ApiResponseModel) {
                    // Error response
                    setError(t.error_loading_trusted || "Failed to load trusted contacts.");
                } else {
                    // Success response
                    setProtectingGuardians(response.protecting);
                    setProtectedGuardians(response.protected);
                    setError(null);
                }
            } catch (err) {
                console.error("Error loading guardians:", err);
                setError(t.error_loading_trusted || "Failed to load trusted contacts.");
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndLoadGuardians();
    }, [t.error_loading_trusted, t.login_required]);

    const handleAddTrusted = () => {
        // TODO: Implement add trusted functionality
        console.log("Add trusted clicked");
    };

    const handleRemoveTrusted = async (id: number) => {
        try {
            const response = await guardianService.removeGuardian(id);
            if (response.status === 200 || response.status === 204) {
                // Successfully removed, refresh the list
                setProtectingGuardians(prev => prev.filter(g => g.id !== id));
                setProtectedGuardians(prev => prev.filter(g => g.id !== id));
            } else {
                console.error("Failed to remove guardian:", response.error);
            }
        } catch (err) {
            console.error("Error removing guardian:", err);
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-secondary">{t.loading || "Loading..."}</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="warning" className="mt-3">
                {error}
            </Alert>
        );
    }

    const hasGuardians = protectingGuardians.length > 0 || protectedGuardians.length > 0;

    return (
        <>
            {/* 🔹 Add trusted button */}
            <div className="d-flex justify-content-end mb-3 mt-3">
                <Button
                    variant="primary"
                    className="rounded-3 fw-semibold"
                    style={{ padding: "0.5rem 1rem" }}
                    onClick={handleAddTrusted}
                    disabled={!isAuthenticated}
                >
                    <Plus size={16} className="me-2" />
                    {t.add_trusted}
                </Button>
            </div>

            {/* 📂 Guardian folders */}
            {!hasGuardians ? (
                <div className="text-center py-5">
                    <p className="text-secondary">{t.no_trusted_found || "No trusted contacts found."}</p>
                </div>
            ) : (
                <>
                    {protectingGuardians.length > 0 && (
                        <FolderElement name="People I Protect" count={protectingGuardians.length}>
                            {protectingGuardians.map((guardian) => (
                                <TrustedElement 
                                    key={guardian.id} 
                                    name={guardian.guardedEmail}
                                    onRemove={() => handleRemoveTrusted(guardian.id)}
                                />
                            ))}
                        </FolderElement>
                    )}

                    {protectedGuardians.length > 0 && (
                        <FolderElement name="People Protecting Me" count={protectedGuardians.length}>
                            {protectedGuardians.map((guardian) => (
                                <TrustedElement 
                                    key={guardian.id} 
                                    name={guardian.guardedEmail}
                                    onRemove={() => handleRemoveTrusted(guardian.id)}
                                />
                            ))}
                        </FolderElement>
                    )}
                </>
            )}
        </>
    );
}