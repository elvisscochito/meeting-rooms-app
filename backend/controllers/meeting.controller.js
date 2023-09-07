import { meetingModel, roomModel } from "../models/models.js";

export const getMeetings = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: req.params.room });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const date = new Date(req.query.date);
    console.info("date: ", date);

    const start = new Date(date);
    /* set start hours from 15:00 */
    start.setUTCHours(14, 0, 0, 0);
    console.info("start: ", start);
    const end = new Date(date);
    /* set end hours to 02 of the nex day */
    end.setUTCHours(2, 0, 0, 0);
    end.setDate(end.getUTCDate());
    console.info("end: ", end);

    /* const formattedDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(); */
    /* const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    const formattedDate = `${year}-${month}-${day}`; */
    /* const [year, month, day] = date.split('T')[0].split('-');
    const start = `${year}/${month}/${day}`; */
    /* console.warn("formattedDate: ", formattedDate); */

    /* const start = new Date(`${formattedDate}T00:00:00Z`);
    console.log("start: ", start);
    const end = new Date(`${formattedDate}T23:59:59.999Z`);
    console.log("end: ", end); */

    /** @note get meetings and their room, both without __v field */

    const meetings = await meetingModel.find({
      room: room._id,
      /* start: { $gte: start, $lt: end } */
    }, { __v: 0 }).populate('room', { __v: 0 });

    res.status(200).json(meetings);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const checkMeetingOverlap = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: req.params.room });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const start = new Date(req.query.start);
    console.log("start: ", start);
    const end = new Date(req.query.end);
    console.log("end: ", end);

    /**
     *  @note check if any meeting overload schedule
     * if any of these conditions are true, the document will be considered a match
     * start: meeting starts within the specified range
     * end: meeting ends within the specified range
     * meeting spans over the entire specified range
     */
    const overlappingMeetings = await meetingModel.find({
      room: room._id,
      $or: [
        { start: { $gte: start, $lt: end } },
        { end: { $gt: start, $lte: end } },
        { start: { $lte: start }, end: { $gte: end } }
      ]
    });

    /* if (overlappingMeetings.length > 0) {
      return res.status(409).json({ message: "Meeting overlaps with another meeting" });
    } */

    const overlap = overlappingMeetings.length > 0;

    res.status(200).json({ overlap });
    /* res.status(200).json(overlappingMeetings); */
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const postMeeting = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: req.params.room });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const newMeeting = await meetingModel.create({
      title: req.body.title,
      description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      host: req.body.host,
      participants: req.body.participants,
      room: room._id,
      key: req.body.key
    });

    await newMeeting.save();

    res.status(201).json(newMeeting);
  }
  catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const putMeeting = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: req.params.room });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const meeting = await meetingModel.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (req.body.key !== meeting.key) {
      return res.status(401).json({ message: "Invalid key. Updated not allowed." });
    }

    /* const meeting = await meetingModel.findByIdAndUpdate(req.params.id, { */
    /* title: req.body.title, */
    meeting.title = req.body.title;
    meeting.description = req.body.description;
    meeting.start = req.body.start;
    meeting.end = req.body.end;
    meeting.host = req.body.host;
    meeting.participants = req.body.participants;
    meeting.room = req.body.room;
    meeting.key = req.body.key;
    /* room: {
      _id: req.body.room._id,
      name: req.body.room.name
    }, */
    /* $inc: { __v: 1 } */
    /* }, { new: true }); */

    const updatedMeeting = await meeting.save();

    res.status(200).json({ message: "Meeting updated successfully", meeting: updatedMeeting });

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const hideMeeting = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: req.params.room });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const meeting = await meetingModel.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (req.body.key !== meeting.key) {
      return res.status(401).json({ message: "Invalid key. Hiding not allowed." });
    }

    meeting.visible = req.body.visible;

    const updatedMeeting = await meeting.save();

    res.status(200).json({ message: "Meeting hidden successfully", meeting: updatedMeeting });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}
