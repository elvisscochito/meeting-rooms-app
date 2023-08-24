import styles from "../styles/MeetingsWrapper.module.css";
import MeetingCard from "./MeetingCard";

const MeetingsWrapper = ({ sortedMeetings, isLoading }) => {
  return (
    <div className={styles.meetingsWrapper}>
      <div className={styles.meetings}>
        {sortedMeetings.length === 0 && !isLoading ? (
          <span className={styles.noMeetingsMessage}>
            {/* No meetings upcoming */}
            {/* Sin reuniones programadas */}
            No hay reuniones programadas
          </span>
        ) : (
          sortedMeetings.map((meeting) => (/* {

            const now = new Date();
            const meetingStart = new Date(meeting.start);
            const meetingEnd = new Date(meeting.end);
            const isActiveMeeting = now >= meetingStart && now <= meetingEnd;
            return ( */

            <MeetingCard meeting={meeting} key={meeting._id} />

            /* ) */
          /* } */))
        )
        }
      </div>
    </div>
  )
}

export default MeetingsWrapper;
