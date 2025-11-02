import type { PropsWithChildren } from "react";
import { Button } from "react-bootstrap";

interface Props {
    title: string;
    subtitle?: string;
    onSubmit: () => void;
    onDelete?: () => void;
    isEditing?: boolean;
    submitLabel?: string;
}

export function EditPageLayout({
   title,
   subtitle,
   onSubmit,
   onDelete,
   isEditing,
   submitLabel,
   children,
}: PropsWithChildren<Props>) {
    return (
        <div
            className="bg-dark text-light position-relative d-flex flex-column"
            style={{
                width: "100%",
                maxWidth: 400,
                minHeight: "100vh",
                overflowX: "hidden",
                overflowY: "hidden",
            }}
        >
            {/* HEADER */}
            <header
                className="border-bottom border-secondary p-3 position-fixed top-0 start-0 end-0 bg-dark"
                style={{ zIndex: 1000 }}
            >
                <h1 className="fw-bold text-primary fs-4 mb-1">TRUST</h1>
                <h5 className="fw-semibold mb-1 mt-2">{title}</h5> {/* ✅ plus d’espace au-dessus */}
                {subtitle && (
                    <small className="text-secondary d-block mt-1">{subtitle}</small>
                )}
            </header>

            {/* MAIN */}
            <main
                className="flex-grow-1 px-3"
                style={{
                    paddingTop: "8rem", // ✅ plus d’espace sous le header
                    paddingBottom: "5rem", // ✅ réduit le vide du bas
                    overflowY: "auto",
                    overflowX: "hidden",
                    scrollbarWidth: "none",
                }}
            >
                <div className="pb-3">{children}</div>
            </main>

            {/* FOOTER */}
            <footer
                className="position-fixed bottom-0 start-0 end-0 bg-dark border-top border-secondary"
                style={{ zIndex: 1000 }}
            >
                <div className="d-flex gap-2 p-3">
                    <Button
                        variant="primary"
                        className="flex-grow-1 fw-semibold"
                        onClick={onSubmit}
                    >
                        {submitLabel ?? (isEditing ? "Modifier" : "Ajouter")}
                    </Button>
                    {isEditing && onDelete && (
                        <Button
                            variant="outline-danger"
                            className="fw-semibold"
                            onClick={onDelete}
                        >
                            Supprimer
                        </Button>
                    )}
                </div>
            </footer>
        </div>
    );
}