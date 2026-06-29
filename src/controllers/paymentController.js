const stripe = require('../config/stripe');
const Payment = require('../models/Payment');

const PREMIUM_PRICE = 1999;

const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'StartupForge Premium', description: 'Post unlimited opportunities' },
          unit_amount: PREMIUM_PRICE,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      customer_email: req.user.email,
      metadata: { user_email: req.user.email, user_name: req.user.name },
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const paymentSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ message: 'No session ID' });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const existingPayment = await Payment.findOne({ transaction_id: session.id });
      if (!existingPayment) {
        await Payment.create({
          user_email: session.metadata?.user_email || req.user.email,
          user_name: session.metadata?.user_name || req.user.name,
          amount: PREMIUM_PRICE / 100,
          transaction_id: session.id,
          payment_status: 'succeeded',
          paid_at: new Date(),
        });
      }
      res.json({ message: 'Payment successful', success: true });
    } else {
      res.json({ message: 'Payment not completed', success: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCheckoutSession, paymentSuccess };
