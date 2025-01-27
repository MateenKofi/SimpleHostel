import { Toaster } from "react-hot-toast";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 6000,
                    style: {
                        background: 'black',
                        color: 'white',
                    },
                }}
            />
            {children}
        </>
    );
};

export default ToastProvider;