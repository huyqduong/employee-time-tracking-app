import * as React from "react";
import { cn } from "../../lib/utils";

type SelectRootProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
};

type SelectTriggerProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

type SelectContentProps = {
  className?: string;
  position?: "popper" | "item-aligned";
  children: React.ReactNode;
  show?: boolean;
};

type SelectItemProps = {
  className?: string;
  value: string;
  children: React.ReactNode;
  onClick?: (value: string) => void;
  selected?: boolean;
};

type SelectValueProps = {
  placeholder?: string;
  children?: React.ReactNode;
};

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = "", children }, ref) => {
    const { setIsOpen, isOpen } = React.useContext(SelectContext);
    
    return (
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {children}
        <span className="ml-2">▼</span>
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, children }, ref) => {
    return (
      <span ref={ref} className="text-gray-500">
        {children || placeholder}
      </span>
    );
  }
);
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = "", children }, ref) => {
    const { isOpen } = React.useContext(SelectContext);
    
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 w-full mt-1 overflow-hidden rounded-md border bg-white shadow-md",
          className
        )}
      >
        <div className="p-1">{children}</div>
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className = "", children, value, selected }, ref) => {
    const { onValueChange, setIsOpen } = React.useContext(SelectContext);
    
    const handleClick = () => {
      onValueChange?.(value);
      setIsOpen(false);
    };

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
          selected && "bg-gray-100",
          className
        )}
        data-value={value}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

const Select: React.FC<SelectRootProps> = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
