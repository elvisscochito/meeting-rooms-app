import express from "express";
import * as meetingController from "../controllers/meeting.controller.js";

const router = express.Router();

router.get("/meetings", meetingController.getMeetings);
router.post("/meeting", meetingController.postMeeting);

export default router;
