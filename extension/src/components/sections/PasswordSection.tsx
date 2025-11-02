import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Search, Plus } from "react-bootstrap-icons";
import { FolderElement } from "../elements/FolderElement";
import { PasswordElement } from "../elements/PasswordElement";

interface PasswordSectionProps {
    t: {
        search_placeholder: string;
        add_password: string;
    };
}

export function PasswordSection({ t }: PasswordSectionProps) {
    const [search, setSearch] = useState("");

    const folders = [
        {
            name: "Comptes personnels",
            items: ["YouTube personnel", "Facebook", "Instagram", "Discord"],
        },
        {
            name: "Comptes professionnels",
            items: ["Courriel école", "Courriel travail"],
        },
    ];

    const filtered = (items: string[]) =>
        items.filter((i) => i.toLowerCase().includes(search.toLowerCase()));

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
                    >
                        <Search size={16} />
                    </Button>
                </InputGroup>

                <Button
                    variant="primary"
                    className="rounded-circle d-flex align-items-center justify-content-center p-0"
                    style={{ width: "38px", height: "38px" }}
                >
                    <Plus size={20} />
                </Button>
            </div>

            {/* 📂 Folders */}
            {folders.map((f, i) => {
                const items = filtered(f.items);
                return (
                    <FolderElement key={i} name={f.name} count={items.length}>
                        {items.map((p, j) => (
                            <PasswordElement key={j} name={p} />
                        ))}
                    </FolderElement>
                );
            })}
        </>
    );
}