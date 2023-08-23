import express from "express";
import * as meetingController from "../controllers/meeting.controller.js";

const router = express.Router();

router.get("/:room/meetings", meetingController.getMeetings);
router.post("/:room/meeting", meetingController.postMeeting);
/* router.post("/:room/meeting/overlap", meetingController.checkMeetingOverlap); */
/* router.get("/:room/meeting?start=:start&end=:end", meetingController.checkMeetingOverlap); */
router.get("/:room/meeting", meetingController.checkMeetingOverlap);

export default router;
