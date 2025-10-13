const { Router } = require("express");

const router = Router();

router.use("/auth", require("./authRoute"));

router.use("/events", require("./eventosRoute"));

router.use("/category", require("./categoryRoute"));

router.use("/home", require("./homeRoute"));

module.exports = router;
