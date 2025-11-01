import { useState } from "react";
import { Button, Form, InputGroup, Collapse } from "react-bootstrap";
import { Search, Plus, ChevronRight, ChevronDown } from "react-bootstrap-icons";

interface PasswordCategory {
    name: string;
    items: string[];
}

interface PasswordSectionProps {
    t: Record<string, string>;
}

export function PasswordSection({ t }: PasswordSectionProps) {
    const [search, setSearch] = useState("");
    const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

    const passwords: PasswordCategory[] = [
        {
            name: t.personal_accounts,
            items: ["YouTube", "Facebook", "Instagram"],
        },
        {
            name: t.professional_accounts,
            items: ["Courriel école", "Courriel travail"],
        },
    ];

    const toggleFolder = (name: string) =>
        setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));

    const filteredPasswords = (cat: PasswordCategory) =>
        cat.items.filter((p) => p.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            {/* Barre de recherche + bouton + */}
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
                    >
                        <Search size={16} />
                    </Button>
                </InputGroup>

                <Button
                    variant="primary"
                    className="rounded-circle d-flex align-items-center justify-content-center p-0"
                    style={{
                        width: "38px",
                        height: "38px",
                        flexShrink: 0,
                    }}
                >
                    <Plus size={20} />
                </Button>
            </div>

            {/* Dossiers */}
            {passwords.map((cat, idx) => {
                const isOpen = openFolders[cat.name];
                const items = filteredPasswords(cat);
                const visible = items.length > 0 || search === "";

                return (
                    <div key={idx} className="mb-3">
                        {visible && (
                            <div
                                className="d-flex align-items-center justify-content-between pb-1 mb-2 user-select-none"
                                style={{
                                    cursor: "pointer",
                                    borderBottom: "1px solid #333",
                                }}
                                onClick={() => toggleFolder(cat.name)}
                            >
                                <div className="fw-semibold small text-uppercase text-secondary">
                                    {isOpen ? <ChevronDown /> : <ChevronRight />} {cat.name}
                                </div>
                                <span className="badge bg-secondary">{items.length}</span>
                            </div>
                        )}

                        <Collapse in={isOpen}>
                            <div>
                                {items.map((p, i) => (
                                    <div
                                        key={i}
                                        className="d-flex justify-content-between align-items-center rounded-3 bg-dark border border-secondary mb-2 px-3 py-2 user-select-none"
                                        style={{
                                            transition: "background-color 0.2s ease",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <span>{p}</span>
                                        <span className="text-secondary">&gt;</span>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <div className="text-secondary small text-center mt-2">
                                        {t.no_results}
                                    </div>
                                )}
                            </div>
                        </Collapse>
                    </div>
                );
            })}
        </>
    );
}