import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayment } from "@/api/payments";
import toast from "react-hot-toast";

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get("reference");

    if (reference) {
      // Call your backend endpoint to verify the payment using the reference
      verifyPayment(reference)
        .then((res) => {
          if (res.verified) {
            toast.success("Payment verified successfully!");
            // Optionally redirect to a success page or update your UI accordingly
            navigate("/payment-success");
          } else {
            toast.error("Payment verification failed.");
            navigate("/payment-failed");
          }
        })
        .catch((err) => {
          console.error("Verification error:", err);
          toast.error("An error occurred during payment verification.");
          navigate("/payment-failed");
        })
        .finally(() => setLoading(false));
    } else {
      toast.error("No payment reference found.");
      setLoading(false);
      navigate("/payment-failed");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <p>Processing payment, please wait...</p>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default PaymentCallback;
