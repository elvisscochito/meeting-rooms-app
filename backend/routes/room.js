import express from "express";
import * as roomController from "../controllers/room.controller.js";

const router = express.Router();

router.get("/rooms", roomController.getRooms);
router.post("/room", roomController.postRoom);

export default router;
