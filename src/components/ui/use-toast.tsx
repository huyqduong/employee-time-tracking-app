import * as React from "react";

interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  type?: "default" | "success" | "error" | "warning";
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 shadow-lg ${
              t.type === "error"
                ? "bg-red-500 text-white"
                : t.type === "success"
                ? "bg-green-500 text-white"
                : t.type === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div>{t.description}</div>}
            {t.action && <div className="mt-2">{t.action}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export const toast = (props: ToastProps) => {
  // This is a simple implementation that shows an alert
  // In a real app, you'd want to use a proper toast library
  alert(`${props.title}\n${props.description}`);
};
