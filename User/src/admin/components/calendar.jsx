import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TaskCalendar = ({ taskDeadlines }) => {
  return (
    <Calendar
      tileContent={({ date }) => {
        const formattedDate = date.toDateString();
        const hasDeadline = taskDeadlines.some(deadline => new Date(deadline.deadline).toDateString() === formattedDate);
        return hasDeadline ? <div style={{ background: 'red' }}>Deadline</div> : null;
      }}
      tileClassName={({ date }) => {
        const day = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
        return day === 0 ? 'black-label' : ''; 
      }}
    />
  );
};

export default TaskCalendar;
