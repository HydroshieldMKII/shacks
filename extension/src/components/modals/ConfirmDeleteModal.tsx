import { Modal, Button } from "react-bootstrap";

interface ConfirmDeleteModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    itemName?: string;
}

export function ConfirmDeleteModal({
   show,
   onHide,
   onConfirm,
   itemName,
}: ConfirmDeleteModalProps) {
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title className="fw-bold text-danger">ATTENTION</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-light text-center">
                <p>
                    Vous êtes sur le point de supprimer{" "}
                    <strong>{itemName ? `"${itemName}"` : "cet élément"}</strong>.
                </p>
                <p>Voulez-vous vraiment le supprimer ?</p>
            </Modal.Body>

            <Modal.Footer className="bg-dark border-secondary d-flex justify-content-center">
                <Button variant="outline-danger" onClick={onConfirm}>
                    Supprimer
                </Button>
                <Button variant="primary" onClick={onHide}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    );
}