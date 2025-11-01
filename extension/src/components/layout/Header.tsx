import { Button } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header
            className="border-bottom border-secondary p-3 position-fixed top-0 start-0 end-0 bg-dark"
            style={{ zIndex: 1000 }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="fw-bold text-primary fs-4 mb-0 user-select-none">TRUST</h1>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-circle border-0 text-light"
                    style={{ backgroundColor: "#2d2d2d" }}
                >
                    <GearFill />
                </Button>
            </div>

            <h5 className="fw-semibold text-light mt-3 mb-0">{title}</h5>
        </header>
    );
}