import { useState, useEffect } from "react";
import { Button, Form, InputGroup, Spinner, Alert } from "react-bootstrap";
import { Search, Plus } from "react-bootstrap-icons";
import { FolderElement } from "../elements/FolderElement";
import { PasswordElement } from "../elements/PasswordElement";
import passwordService from "../../services/passwordService";
import { FolderModel } from "../../models/folder.model";
import { ApiResponseModel } from "../../services/apiService";

interface PasswordSectionProps {
    t: {
        search_placeholder: string;
        add_password: string;
        loading?: string;
        error?: string;
        try_again?: string;
        no_passwords_found?: string;
        no_passwords_yet?: string;
    };
    onAddPassword?: () => void;
    onEditPassword?: (passwordId: number) => void;
    onRefresh?: (refreshFn: () => void) => void;
}

export function PasswordSection({ t, onAddPassword, onEditPassword, onRefresh }: PasswordSectionProps) {
    const [search, setSearch] = useState("");
    const [folders, setFolders] = useState<FolderModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPasswords();
        // Pass refresh function to parent if callback provided
        if (onRefresh) {
            onRefresh(refreshPasswords);
        }
    }, [onRefresh]);

    const loadPasswords = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await passwordService.getPasswords();
            
            if (Array.isArray(result)) {
                setFolders(result);
            } else {
                // Handle error response
                const apiError = result as ApiResponseModel;
                setError(apiError.error || 'Failed to load passwords');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filteredFolders = folders.map(folder => ({
        ...folder,
        passwords: folder.passwords.filter(password =>
            password.name.toLowerCase().includes(search.toLowerCase()) ||
            password.username.toLowerCase().includes(search.toLowerCase()) ||
            (password.url && password.url.toLowerCase().includes(search.toLowerCase()))
        )
    })).filter(folder => folder.passwords.length > 0 || search === "");

    // Expose refresh function for parent components
    const refreshPasswords = () => {
        loadPasswords();
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-light">{t.loading || 'Loading passwords...'}</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-3">
                <Alert.Heading>{t.error || 'Error'}</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" size="sm" onClick={loadPasswords}>
                    {t.try_again || 'Try Again'}
                </Button>
            </Alert>
        );
    }

    return (
        <>
            {/* 🔍 Barre de recherche */}
            <div className="d-flex align-items-center gap-2 mb-4 mt-3">
                <InputGroup className="flex-grow-1">
                    <Form.Control
                        type="text"
                        placeholder={t.search_placeholder}
                        className="bg-dark text-light border-secondary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        variant="outline-secondary"
                        className="border-secondary rounded-end-3 d-flex align-items-center justify-content-center"
                        style={{ width: "42px" }}
                        onClick={() => setSearch("")}
                        title={search ? "Clear search" : "Search"}
                    >
                        <Search size={16} />
                    </Button>
                </InputGroup>

                <Button
                    variant="primary"
                    className="rounded-3 d-flex align-items-center justify-content-center p-0"
                    style={{ width: "38px", height: "38px", minWidth: "38px", minHeight: "38px" }}
                    onClick={onAddPassword}
                    title={t.add_password}
                >
                    <Plus size={20} />
                </Button>
            </div>

            {/* 📂 Folders */}
            {filteredFolders.length === 0 && search !== "" ? (
                <div className="text-center py-5">
                    <p className="text-light">{t.no_passwords_found || 'No passwords found matching your search.'}</p>
                </div>
            ) : filteredFolders.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-light">{t.no_passwords_yet || 'No passwords yet. Add your first password!'}</p>
                </div>
            ) : (
                filteredFolders.map((folder) => (
                    <FolderElement key={folder.id} name={folder.name} count={folder.passwords.length}>
                        {folder.passwords.map((password) => (
                            <PasswordElement 
                                key={password.id || `${folder.id}-${password.name}`} 
                                name={password.name}
                                onClick={() => {
                                    if (password.id && onEditPassword) {
                                        onEditPassword(password.id);
                                    }
                                }}
                            />
                        ))}
                    </FolderElement>
                ))
            )}
        </>
    );
}