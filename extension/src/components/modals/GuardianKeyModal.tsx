import { Modal, Button, Form } from "react-bootstrap";
import { Copy, Check } from "react-bootstrap-icons";
import { useState } from "react";

interface GuardianKeyModalProps {
    show: boolean;
    onHide: () => void;
    guardianKey: string;
    guardianEmail: string;
    t: {
        title: string;
        message: string;
        security_notice: string;
    };
    actions: {
        copy: string;
        copied: string;
        close: string;
    };
}

export function GuardianKeyModal({
    show,
    onHide,
    guardianKey,
    guardianEmail,
    t,
    actions,
}: GuardianKeyModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(guardianKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy:', err);
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = guardianKey;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const message = t.message.replace('{email}', guardianEmail);

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title className="fw-bold text-primary">{t.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-light">
                <div className="mb-4">
                    <p className="text-light">{message}</p>
                </div>

                <div className="mb-3">
                    <Form.Label className="fw-semibold text-light">Guardian Key:</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="text"
                            value={guardianKey}
                            readOnly
                            className="bg-dark text-light border-secondary font-monospace"
                            style={{ 
                                fontSize: '0.9rem',
                                letterSpacing: '0.5px',
                                userSelect: 'all'
                            }}
                        />
                        <Button
                            variant={copied ? "success" : "outline-primary"}
                            onClick={handleCopy}
                            className="d-flex align-items-center"
                            style={{ minWidth: '80px' }}
                        >
                            {copied ? (
                                <>
                                    <Check size={16} className="me-1" />
                                    {actions.copied}
                                </>
                            ) : (
                                <>
                                    <Copy size={16} className="me-1" />
                                    {actions.copy}
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="alert alert-info bg-dark border-info text-info small">
                    {t.security_notice}
                </div>
            </Modal.Body>

            <Modal.Footer className="bg-dark border-secondary d-flex justify-content-center">
                <Button variant="primary" onClick={onHide}>
                    {actions.close}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}