import { Button, Spinner, Alert } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import { FolderElement } from "../elements/FolderElement";
import { TrustedElement } from "../elements/TrustedElement";
import { GuardianKeyModal } from "../modals/GuardianKeyModal";
import { GuardianModel } from "../../models/guardian.model";
import guardianService from "../../services/guardianService";
import authService from "../../services/authService";
import { ApiResponseModel } from "../../services/apiService";

interface TrustedSectionProps {
    t: {
        add_trusted: string;
        loading: string;
        no_trusted_found: string;
        error_loading_trusted: string;
        login_required: string;
    };
    trustedT: {
        people_i_protect: string;
        people_protecting_me: string;
    };
    guardianKeyT: {
        title: string;
        message: string;
        security_notice: string;
    };
    actionsT: {
        copy: string;
        copied: string;
        close: string;
    };
    onAddTrusted?: () => void;
}

export function TrustedSection({ t, trustedT, guardianKeyT, actionsT, onAddTrusted }: TrustedSectionProps) {
    const [protectingGuardians, setProtectingGuardians] = useState<GuardianModel[]>([]);
    const [protectedGuardians, setProtectedGuardians] = useState<GuardianModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [selectedGuardian, setSelectedGuardian] = useState<GuardianModel | null>(null);

    useEffect(() => {
        const checkAuthAndLoadGuardians = async () => {
            try {
                const authenticated = await authService.isAuthenticated();
                setIsAuthenticated(authenticated);

                if (!authenticated) {
                    setError(t.login_required);
                    setLoading(false);
                    return;
                }

                const response = await guardianService.getGuardians();
                
                if (response instanceof ApiResponseModel) {
                    // Check if it's a 404 (no guardians found) vs real error
                    if (response.status === 404) {
                        // No guardians found - this is normal, not an error
                        setProtectingGuardians([]);
                        setProtectedGuardians([]);
                        setError(null);
                    } else {
                        // Real error response
                        setError(t.error_loading_trusted);
                    }
                } else {
                    // Success response
                    setProtectingGuardians(response.protecting);
                    setProtectedGuardians(response.protected);
                    setError(null);
                }
            } catch (err) {
                console.error("Error loading guardians:", err);
                // Instead of showing error immediately, assume empty state
                // This handles cases where backend returns error for empty results
                setProtectingGuardians([]);
                setProtectedGuardians([]);
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndLoadGuardians();
    }, [t.error_loading_trusted, t.login_required]);

    const handleAddTrusted = () => {
        if (onAddTrusted) {
            onAddTrusted();
        }
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

    const handleShowKey = (guardian: GuardianModel) => {
        if (guardian.guardianKeyValue) {
            setSelectedGuardian(guardian);
            setShowKeyModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowKeyModal(false);
        setSelectedGuardian(null);
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-light">{t.loading}</p>
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
            <div className="mb-3 mt-3">
                <Button
                    variant="primary"
                    className="w-100 rounded-3 fw-semibold"
                    style={{ 
                        padding: "0.5rem 1rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "38px"
                    }}
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
                    <p className="text-light">{t.no_trusted_found}</p>
                </div>
            ) : (
                <>
                    {protectingGuardians.length > 0 && (
                        <FolderElement name={trustedT.people_i_protect} count={protectingGuardians.length}>
                            {protectingGuardians.map((guardian) => (
                                <TrustedElement 
                                    key={guardian.id} 
                                    name={guardian.guardedEmail}
                                    onRemove={() => handleRemoveTrusted(guardian.id)}
                                    onShowKey={() => handleShowKey(guardian)}
                                    showKeyButton={true}
                                />
                            ))}
                        </FolderElement>
                    )}

                    {protectedGuardians.length > 0 && (
                        <FolderElement name={trustedT.people_protecting_me} count={protectedGuardians.length}>
                            {protectedGuardians.map((guardian) => (
                                <TrustedElement 
                                    key={guardian.id} 
                                    name={guardian.guardedEmail}
                                    onRemove={() => handleRemoveTrusted(guardian.id)}
                                    showKeyButton={false}
                                />
                            ))}
                        </FolderElement>
                    )}
                </>
            )}

            {/* Guardian Key Modal */}
            {selectedGuardian && (
                <GuardianKeyModal
                    show={showKeyModal}
                    onHide={handleCloseModal}
                    guardianKey={selectedGuardian.guardianKeyValue || ''}
                    guardianEmail={selectedGuardian.guardedEmail}
                    t={guardianKeyT}
                    actions={actionsT}
                />
            )}
        </>
    );
}