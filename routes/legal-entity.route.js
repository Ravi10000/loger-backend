const express = require("express");
const { addLegalEntity } = require("../controllers/legal-entity.controller");
const { isUser } = require("../middlewares/auth.middleware");
const { body } = require("express-validator");

const router = express.Router();

router.post("/", isUser, isAdmin, [body()], addLegalEntity);

module.exports = router;
