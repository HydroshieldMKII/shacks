import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

interface TrustedSectionProps {
    t: Record<string, string>;
}

export function TrustedSection({ t }: TrustedSectionProps) {
    const trustedPeople = ["Camille Rondeau", "Tom Gaillard", "Nathan Bienvenu"];

    return (
        <>
            <div className="d-grid mb-3 mt-3">
                <Button
                    variant="primary"
                    className="rounded-3 fw-semibold"
                    style={{ padding: "0.5rem 1rem" }}
                >
                    <Plus size={16} className="me-2" />
                    {t.add_person}
                </Button>
            </div>

            {trustedPeople.map((p, i) => (
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
        </>
    );
}