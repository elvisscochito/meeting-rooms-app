import express from "express";
import * as datetimeController from "../controllers/datetime.controller.js";

const router = express.Router();

router.get("/datetime", datetimeController.getDateTime);

export default router;
