import { Toaster } from "@components/ui/sonner";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Toaster position="bottom-right" duration={6000} />
            {children}
        </>
    );
};

export default ToastProvider;