import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

export function TrustedSection() {
    const trustedPeople = ["Camille Rondeau", "Tom Gaillard", "Nathan Bienvenu"];

    return (
        <div className="px-3 pb-4 mt-3">
            <div className="d-grid mb-3 mt-3">
                <Button variant="primary" className="rounded-3 fw-semibold">
                    <Plus size={16} className="me-2" /> Ajouter une personne
                </Button>
            </div>

            {trustedPeople.map((p, i) => (
                <div
                    key={i}
                    className="d-flex justify-content-between align-items-center rounded-3 bg-dark border border-secondary mb-2 px-3 py-2 user-select-none"
                    style={{ cursor: "pointer" }}
                >
                    <span>{p}</span>
                    <span className="text-secondary">&gt;</span>
                </div>
            ))}
        </div>
    );
}