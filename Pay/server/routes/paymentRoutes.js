const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/", paymentController.handlePayment);  // 결제 처리

module.exports = router;
