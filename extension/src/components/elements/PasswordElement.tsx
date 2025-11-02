import { useState } from "react";
import { ChevronRight } from "react-bootstrap-icons";

interface PasswordItemProps {
    name: string;
    onClick?: () => void;
    onAutoFill?: () => void;
}

export function PasswordElement({ name, onClick, onAutoFill }: PasswordItemProps) {
    const [isFilling, setIsFilling] = useState(false);

    const handleAutoFill = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Empêcher de déclencher onClick
        if (onAutoFill && !isFilling) {
            setIsFilling(true);
            await onAutoFill();
            setTimeout(() => setIsFilling(false), 2000);
        }
    };

    return (
        <div
            className="d-flex justify-content-between align-items-center rounded-3 bg-dark border border-secondary mb-2 px-3 py-2 user-select-none"
            style={{
                transition: "background-color 0.2s ease",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <span className="fw-medium text-light">{name}</span>
            <div className="d-flex align-items-center gap-2">
                {onAutoFill && (
                    <button
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center px-2 py-1"
                        style={{ 
                            minWidth: "45px", 
                            height: "28px",
                            border: "1px solid #6c757d",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: isFilling ? '#6c757d' : '#adb5bd',
                            transition: 'all 0.2s ease',
                        }}
                        onClick={handleAutoFill}
                        disabled={isFilling}
                        title="Auto-fill on current page"
                    >
                        {isFilling ? (
                            <span className="loading-dots">
                                <span>.</span><span>.</span><span>.</span>
                            </span>
                        ) : (
                            'Fill'
                        )}
                    </button>
                )}
                <ChevronRight size={16} className="text-light" />
            </div>

            <style>{`
                @keyframes blink {
                    0%, 20% { opacity: 0.3; }
                    40% { opacity: 1; }
                    60%, 100% { opacity: 0.3; }
                }
                .loading-dots span {
                    animation: blink 1.4s infinite;
                }
                .loading-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .loading-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }
            `}</style>
        </div>
    );
}