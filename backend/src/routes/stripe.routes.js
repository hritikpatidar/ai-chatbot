import express from "express";

import {
  getPaymentIntent,
  confirmPaymentIntent,
  getInvoice,
} from "../controllers/stripe.controller.js";

const router = express.Router();

/* =========================================================
   PAYMENT INTENT
========================================================= */

// Get payment intent
router.get("/payment-intent/:paymentIntentId", getPaymentIntent);

// Confirm payment intent
router.post("/payment-intent/confirm", confirmPaymentIntent);

/* =========================================================
   INVOICE
========================================================= */

// Get invoice
router.get("/invoice/:invoiceId", getInvoice);

export default router;
