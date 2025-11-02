import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { FolderElement } from "../elements/FolderElement";
import { TrustedElement } from "../elements/TrustedElement";

interface TrustedSectionProps {
    t: {
        add_trusted: string;
    };
}

export function TrustedSection({ t }: TrustedSectionProps) {
    const trustedGroups = [
        {
            name: "Famille",
            items: ["Camille Rondeau", "Tom Gaillard"],
        },
        {
            name: "Amis de confiance",
            items: ["Nathan Bienvenu", "Camil Rondeau"],
        },
    ];

    return (
        <>
            {/* 🔹 Bouton d’ajout principal */}
            <div className="d-flex justify-content-end mb-3 mt-3">
                <Button
                    variant="primary"
                    className="rounded-3 fw-semibold"
                    style={{ padding: "0.5rem 1rem" }}
                >
                    <Plus size={16} className="me-2" />
                    {t.add_trusted}
                </Button>
            </div>

            {/* 📂 Folders */}
            {trustedGroups.map((group, i) => (
                <FolderElement key={i} name={group.name} count={group.items.length}>
                    {group.items.map((p, j) => (
                        <TrustedElement key={j} name={p} />
                    ))}
                </FolderElement>
            ))}
        </>
    );
}