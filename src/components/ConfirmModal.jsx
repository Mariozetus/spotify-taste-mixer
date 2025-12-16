import { useClickOutside } from "@/hooks/useClickOutside";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", confirmStyle = "negative" }) {
    if (!isOpen) return null;
    const dropdownRef = useClickOutside(onClose);

    return (
        <div className="fixed inset-0 bg-background-base bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div ref={dropdownRef} className="bg-background-elevated-base rounded-lg p-4 sm:p-6 max-w-md w-full border border-background-elevated-highlight">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{title}</h2>
                <p className="text-text-subdued mb-4 sm:mb-6 text-sm sm:text-base">
                    {message}
                </p>
                <div className="flex gap-2 sm:gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-3 sm:px-4 py-2 cursor-pointer text-sm sm:text-base rounded-full bg-background-elevated-highlight hover:bg-background-elevated-press transition-colors duration-200 font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-3 sm:px-4 py-2 text-sm cursor-pointer sm:text-base rounded-full text-white hover:opacity-90 transition-opacity duration-200 font-medium ${
                            confirmStyle === 'negative' ? 'bg-essential-negative' : 'bg-essential-bright-accent'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
