import Razorpay from 'razorpay';

// Initialize Razorpay instance using environment variables.
// Use mock key text if environment variables are not supplied to prevent server crash.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkeyid123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mocksecret123',
});

export default razorpay;
