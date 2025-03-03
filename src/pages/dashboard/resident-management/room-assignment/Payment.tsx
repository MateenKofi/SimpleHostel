import PaymentForm from "@/components/payment/Payment";

const Payment = () => {
  return (
    <div className="p-6 bg-gray-100">
     
      <div className="w-full ">
        <PaymentForm amount={788} description={""} />
      </div>
    </div>
  );
};

export default Payment;
