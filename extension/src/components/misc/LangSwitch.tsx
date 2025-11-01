interface LangSwitchProps {
    lang: "fr" | "en";
    on_toggle: () => void;
}

export function LangSwitch({ lang, on_toggle }: LangSwitchProps) {
    return (
        <div className="text-center mt-3">
            <small
                className="text-secondary"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={on_toggle}
            >
                {lang === "fr" ? "FR | EN" : "EN | FR"}
            </small>
        </div>
    );
}