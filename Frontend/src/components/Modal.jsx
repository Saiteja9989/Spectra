import { useDarkMode } from './DarkModeContext';
import { X } from 'lucide-react'; // Import the X icon

const Modal = ({ isOpen, onClose, title, type = 'info', children, onConfirm, onReject }) => {
  const { darkMode } = useDarkMode(); // Access dark mode state

  if (!isOpen) return null;

  // Function to determine background color based on type and dark mode
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return darkMode ? 'bg-green-900' : 'bg-green-50';
      case 'error':
        return darkMode ? 'bg-red-900' : 'bg-red-50';
      default:
        return darkMode ? 'bg-blue-900' : 'bg-blue-50';
    }
  };

  // Function to determine text color based on dark mode
  const getTextColor = () => {
    return darkMode ? 'text-gray-100' : 'text-gray-800'; // Adjust text color for dark mode
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Blurred Background */}
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30" onClick={onClose} />

      {/* Modal Content */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-lg ${getBgColor()} p-8 shadow-xl transition-all sm:w-full sm:max-w-lg`}>
          {/* Close Button */}
          <div className="absolute right-4 top-4">
            <button
              onClick={() => {
                console.log("Modal closed or canceled"); // Debugging
                onClose();
                onReject?.(); // Trigger onReject when the modal is closed
              }}
              className="rounded-full p-1 hover:bg-gray-200 focus:outline-none"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Title */}
          <div className="mb-4">
            <h3 className={`text-lg font-medium leading-6 ${getTextColor()}`}>
              {title}
            </h3>
          </div>

          {/* Modal Content */}
          <div className={`mt-2 ${getTextColor()}`}>
            {children}
          </div>

          {/* Modal Actions */}
          {onConfirm && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  console.log("Cancel button clicked"); // Debugging
                  onClose();
                  onReject?.(); // Trigger onReject when the user cancels
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Confirm button clicked"); // Debugging
                  onConfirm(); // Trigger onConfirm when the user confirms
                  onClose();
                }}
                className={`px-4 py-2 text-sm font-medium text-white ${
                  type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                  type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-blue-600 hover:bg-blue-700'
                } rounded-md`}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;