const express = require("express");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();

app.use(bodyParser.json());
app.use("/api/payment", paymentRoutes);  // '/api/payment' 경로로 라우터 연결

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
