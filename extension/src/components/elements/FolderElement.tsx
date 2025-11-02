import { useState, type ReactNode } from "react";
import { Collapse } from "react-bootstrap";
import { ChevronRight, ChevronDown } from "react-bootstrap-icons";

interface FolderProps {
    name: string;
    count?: number;
    children: ReactNode;
}

export function FolderElement({ name, count, children }: FolderProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="mb-3">
            <div
                className="d-flex align-items-center justify-content-between pb-1 mb-2 user-select-none"
                style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #333",
                }}
                onClick={() => setOpen(!open)}
            >
                <div className="fw-semibold small text-uppercase text-secondary">
                    {open ? <ChevronDown /> : <ChevronRight />} {name}
                </div>
                {typeof count === "number" && (
                    <span className="badge bg-secondary">{count}</span>
                )}
            </div>

            <Collapse in={open}>
                <div>{children}</div>
            </Collapse>
        </div>
    );
}