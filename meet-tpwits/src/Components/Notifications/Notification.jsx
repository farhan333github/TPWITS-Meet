import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notification.css";

const Notifications = ({ refreshMeetings }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const API_BASE_URL = "http://172.25.0.109:3000/notifications";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setNotifications(
        response.data.notifications.map((notif) => ({ ...notif, selected: false, responded: false }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleResponse = async (meetingId, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const requestData = { meeting_id: meetingId, status };

      await axios.post(
        `${API_BASE_URL}/respond`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Update notification status and mark it as responded
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.meeting_id === meetingId ? { ...notif, responded: true } : notif
        )
      );

      // Optionally refresh meetings UI, if the function is defined
      if (typeof refreshMeetings === "function") {
        refreshMeetings();
      }

    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, selected: newSelectAll }))
    );
  };

  const handleIndividualSelect = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, selected: !notif.selected } : notif
      )
    );
  };

  return (
    <div className="notifications-container">
      <h2>🔔 Notifications</h2>
      <table className="notifications-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.length === 0 ? (
            <tr>
              <td colSpan="3">No notifications.</td>
            </tr>
          ) : (
            notifications.map((notif) => (
              <tr key={notif.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={notif.selected || false}
                    onChange={() => handleIndividualSelect(notif.id)}
                  />
                </td>
                <td>{notif.message}</td>
                <td className="Unlist2">
                  {notif.meeting_id && !notif.responded && (
                    <>
                      <button onClick={() => handleResponse(notif.meeting_id, "Accepted")}>
                        ✅ Accept
                      </button>
                      <button onClick={() => handleResponse(notif.meeting_id, "Declined")}>
                        ❌ Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;




