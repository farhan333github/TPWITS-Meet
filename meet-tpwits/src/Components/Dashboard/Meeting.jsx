import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Meeting.css";
import { FaEllipsisV } from "react-icons/fa";


const Meeting = () => {
  const [formData, setFormData] = useState({
    title: "",
    meetingTime: "",
    attendees: [],
    inputValue: "",
    responseMessage: "",
    meetings: [],
    isEditing: false,
    currentMeetingId: null,
  });

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);


  const API_BASE_URL = "http://172.25.0.109:3000/meetings";
  const USERS_API_URL = "http://172.25.0.109:3000/auth/";

  useEffect(() => {
    fetchMeetings();
    fetchUsers();
    fetchCurrentUser();
  }, []);
const fetchCurrentUser = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("🚨 No token found, redirecting to login...");
            return;
        }

        const response = await axios.get(`${USERS_API_URL}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        });

        if (response.data.success && response.data.user) {
            setCurrentUser(response.data.user);
        }
    } catch (error) {
        console.error("Error fetching current user:", error);

        // If token is expired, log out user
        if (error.response?.status === 401) {
            console.warn("🚨 Token expired. Logging out...");
            localStorage.removeItem("token");
            window.location.reload(); // Redirect to login page
        }
    }
};

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(USERS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (formData.inputValue) {
      const filtered = users.filter((user) =>
        user.full_name.toLowerCase().includes(formData.inputValue.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [formData.inputValue, users]);

  const fetchMeetings = async () => {
    setLoading(true); 
    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}/all`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        });

        const formattedMeetings = response.data.meetings.map((meeting) => ({
            ...meeting,
            meetingTime: meeting.meetingTime 
                ? new Date(meeting.meetingTime).toLocaleString("en-US", { timeZone: "Asia/Karachi" }) 
                : "Invalid Date",
            attendees: Array.isArray(meeting.attendees)
                ? meeting.attendees.map((att) => ({
                    name: att.name || att.user?.full_name || "Unknown",
                    response: att.response || "Pending",
                }))
                : [],
        }));

        setFormData((prev) => ({ ...prev, meetings: formattedMeetings }));
    } catch (error) {
        console.error("Error fetching meetings:", error);
    }
    setLoading(false); 
};


  
  // ✅ Fixed: Added the missing addAttendee function
  const addAttendee = (user) => {
    if (!user || !user.full_name) return;
  
    // Optimize by using a Set instead of looping twice
    const attendeesSet = new Set(formData.attendees.map((att) => att.name));
    if (!attendeesSet.has(user.full_name)) {
      setFormData((prev) => ({
        ...prev,
        attendees: [...prev.attendees, { name: user.full_name, response: "Pending" }],
        inputValue: "",
      }));
      setShowDropdown(false);
    }
  };
  
  const removeAttendee = (attendeeName) => {
    const updatedAttendees = formData.attendees.filter(
      (att) => att.name !== attendeeName
    );
    setFormData((prev) => ({
      ...prev,
      attendees: updatedAttendees,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      meetingTime: "",
      attendees: [],
      inputValue: "",
      responseMessage: "",
      meetings: formData.meetings,
      isEditing: false,
      currentMeetingId: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { title, meetingTime, attendees, isEditing, currentMeetingId } = formData;
  
    if (!title || !meetingTime || attendees.length === 0) {
      setFormData((prev) => ({
        ...prev,
        responseMessage: "All fields are required!",
      }));
      return;
    }
  
    const localTime = new Date(meetingTime);
    const utcTime = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000).toISOString();
  
    const meetingData = {
      title,
      meeting_time: utcTime,  // Send UTC format to backend
      attendees: attendees.map((att) => att.name.trim()),
    };
  
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const config = {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      withCredentials: true,
    };
  
    try {
      let response;
      if (isEditing) {
        // Update meeting request
        response = await axios.put(`${API_BASE_URL}/update/${currentMeetingId}`, meetingData, config);
      } else {
        // Create meeting request
        response = await axios.post(`${API_BASE_URL}/create`, meetingData, config);
      }
  
      setFormData((prev) => ({
        ...prev,
        responseMessage: isEditing ? "Meeting updated successfully!" : "Meeting created successfully!",
        isEditing: false,
        currentMeetingId: null,
      }));
  
      resetForm();
      fetchMeetings(); // Refresh meeting list
    } catch (error) {
      console.error("Error creating/updating meeting:", error);
      setFormData((prev) => ({
        ...prev,
        responseMessage: "An error occurred. Please try again later.",
      }));
    }
  };
  
  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      await axios.delete(`${API_BASE_URL}/delete/${meetingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      fetchMeetings();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      setFormData((prev) => ({
        ...prev,
        responseMessage: "Error deleting meeting. Please try again.",
      }));
    }
  };
  

  const editMeeting = (meeting) => {
    const updatedAttendees = meeting.attendees.map((att) => ({
      name: att.name || att.user?.full_name,
      response: att.response || "Pending",
    }));
  
    setFormData((prev) => ({
      ...prev,
      title: meeting.title,
      meetingTime: meeting.meetingTime,
      attendees: [...updatedAttendees], // Ensure immutability
      isEditing: true,
      currentMeetingId: meeting.id,
    }));
  };
  
  return (
    <div className="meetings">
  
      <h3>{formData.isEditing ? "Update Meeting" : "Create Meeting"}</h3>

      <div className="second-meeting">
        <label>Meeting Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />


<label>Meeting Date & Time</label>
<input
  type="datetime-local"
  value={formData.meetingTime ? new Date(formData.meetingTime).toISOString().slice(0, 16) : ""}
  onChange={(e) => {
      const localTime = new Date(e.target.value);
      if (isNaN(localTime.getTime())) {
          console.error("❌ Invalid Date Selected:", e.target.value);
          return;
      }
      // Convert to UTC before storing
      const utcTime = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000).toISOString();
      setFormData({ ...formData, meetingTime: utcTime });
  }}
/>



        <label>Attendees</label>
        <input
          type="text"
          value={formData.inputValue}
          onChange={(e) => setFormData({ ...formData, inputValue: e.target.value })}
          placeholder="Search attendees"
        />

        {showDropdown && (
          <ul className="dropdown">
            {filteredUsers.map((user) => (
              <li key={user.id} onClick={() => addAttendee(user)}>
                {user.full_name}
              </li>
            ))}
          </ul>
        )}

        <div className="selected-attendees">
          {formData.attendees.map((att) => (
            <span key={att.name} className="attendee-badge">
              {att.name}
              <button onClick={() => removeAttendee(att.name)} className="remove-btn">✕</button>
            </span>
          ))}
        </div>
        
      </div>

      <button onClick={handleSubmit}>{formData.isEditing ? "Update" : "Submit"}</button>

      <h3>Meeting List</h3>
      {formData.meetings.length > 0 ? (
        <table className="meetings-table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Date & Time</th>
        <th>Attendees</th>
        <th>Responses</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {formData.meetings.map((meeting) => (
        <tr key={meeting.id}>
          <td>{meeting.title}</td>
          <td>
  {meeting.meetingTime && !isNaN(new Date(meeting.meetingTime)) 
    ? new Date(meeting.meetingTime).toLocaleString("en-US", { timeZone: "Asia/Karachi" }) 
    : "Invalid Date"}
</td>



          <td>
  {meeting.attendees.length > 0
    ? meeting.attendees.map((att) => att.name?.full_name || att.name || "Unknown").join(", ")
    : "No Attendees"}
</td>

<td>
  {meeting.attendees.length > 0
    ? meeting.attendees.map((att) => att.response || "Pending").join(", ")
    : "No Responses"}
</td>

          <td className="btndiv">
            <button onClick={() => editMeeting(meeting)}>Edit</button>
            <button onClick={() => handleDeleteMeeting(meeting.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
      ) : (
        <p>No meetings available.</p>
      )}

      {/* Show Cards on Small Screens */}
      <div className="meeting-card-container">
        {formData.meetings.map((meeting) => (
          <div key={meeting.id} className="meeting-card">
            <div className="meeting-card-header">
              <h4>{meeting.title}</h4>
              <FaEllipsisV
                className="dots-icon"
                onClick={() => setOpenMenuId(openMenuId === meeting.id ? null : meeting.id)}
              />
              {openMenuId === meeting.id && (
                <div className="action-menu">
                  <button onClick={() => editMeeting(meeting)}>Edit</button>
                  <button onClick={() => handleDeleteMeeting(meeting.id)}>Delete</button>
                </div>
              )}
            </div>

            <p className="meeting-time">{meeting.meetingTime}</p>

            <div className="attendees-list">
              {meeting.attendees.map((att) => (
                <span key={att.name} className={`attendee-badge ${att.response.toLowerCase()}`}>
                  {att.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {formData.responseMessage && <p className="response-message">{formData.responseMessage}</p>}
    </div>
  );
};

export default Meeting;