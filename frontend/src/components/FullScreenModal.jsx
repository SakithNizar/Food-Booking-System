import { X } from "lucide-react";

export default function FullScreenModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400  bg-opacity-50 h-screen w-full z-50 customBorder">
      <div className="fixed inset-0 bg-white p-6 shadow-lg flex flex-col  w-fit h-fit">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
