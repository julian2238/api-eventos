const { Router } = require("express");

const router = Router();

router.use("/auth", require("./authRoute"));

router.use("/eventos", require("./eventosRoute"));

module.exports = router;
