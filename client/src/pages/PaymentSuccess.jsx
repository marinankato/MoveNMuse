// Shirley
export default function PaymentSuccess() {


  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Payment Result</h1>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Payment Successful!</h2>
          <p className="text-gray-700">Thank you for your payment. Your transaction has been completed successfully.</p>
          <p className="text-gray-700 mt-2">You can view your booking details in your account.</p>
        </div>
      </div>
    </div>
  );
}
