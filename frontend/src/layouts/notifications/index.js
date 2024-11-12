import React, { useState, useEffect } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { notificationApi } from '../../appClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const role = localStorage.getItem('role');
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationApi.getNotifications(id);
        setNotifications(response);
        setLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }, [id]);

  const handleMarkAsRead = async () => {
    try {
      await notificationApi.updateNotification(id);
      const response = await notificationApi.getNotifications(id);
      setNotifications(response);
    } catch (error) {
      console.error(error);
    }
  };
  const displayNotifications = () => {
    if (role === 'student') {
      return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-8">Notifications</h1>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification ${notification.read ? 'read' : 'unread'}`}
                onClick={() => handleMarkAsRead(notification._id)}
              >
                <div className="notification-header">
                  <h2 className="text-2xl font-bold text-blue-500 mb-2">{notification.title}</h2>
                  <span
                    className={`status-dot ${notification.read ? 'read-dot' : 'unread-dot'} ${
                      notification.read ? '' : 'pulse'
                    }`}
                  ></span>
                </div>
                <p className="text-lg">{notification.message}</p>
              </div>
            ))
          ) : (
            <p className="text-lg">You have no notifications.</p>
          )}
        </div>
      );
    } else if (role === 'lecturer' || role === 'admin') {
      return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-8">Notifications</h1>
          <p className="text-lg">You have no notifications.</p>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {loaded && displayNotifications()}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default Notifications;
