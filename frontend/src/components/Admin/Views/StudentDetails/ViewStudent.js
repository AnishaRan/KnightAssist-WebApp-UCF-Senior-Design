import React from 'react';
import { useParams } from 'react-router-dom';

const StudentDetailsPage = ({ student }) => {
    const { studentId } = useParams();

	function hourString(totalHours){
		const hourStr = totalHours.toString();

		// It is a whole hour
		if(!hourStr.includes('.')) return hourStr + ":00";

		const hours = hourStr.substring(0, hourStr.indexOf("."));

		const noHours = hours === "";

		// Less than 10 minutes
		const leadingZero = Number(hourStr.substring(hourStr.indexOf(".") + 1)) < 17;

		const minutes = Math.round((Number(hourStr.substring(hourStr.indexOf(".") + 1)) / 100) * 60);

		return ((noHours) ? "0" : "") + hours + ":" + ((leadingZero) ? "0" : "") + minutes;
	}
	  
  return (
    <div>
      <h2>Student Details</h2>
      <p>First Name: {student.firstName}</p>
      <p>Last Name: {student.lastName}</p>
      <p>Created: {student.createdAt}</p>
      <p>Email: {student.email}</p>
      <p>Total Volunteer Hours: {hourString(student.totalVolunteerHours)}</p>
    </div>
  );
};

export default StudentDetailsPage;
