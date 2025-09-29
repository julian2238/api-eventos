const { Router } = require("express");

const router = Router();

router.use("/auth", require("./authRoute"));

router.use("/eventos", require("./eventosRoute"));

router.use("/category", require("./categoryRoute"));

module.exports = router;
