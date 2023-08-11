import express from "express";
import * as meetingController from "../controllers/meeting.controller.js";

const router = express.Router();

router.get("/:room/meetings", meetingController.getMeetings);
router.post("/:room/meeting", meetingController.postMeeting);

export default router;
