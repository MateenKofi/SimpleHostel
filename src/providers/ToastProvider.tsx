import { Toaster } from "react-hot-toast";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Toaster position="top-right" />
            {children}
        </>
    );
};

export default ToastProvider;
