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

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(notifications.filter((notification) => notification._id !== notificationId));
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
              <div key={notification._id} className="bg-white p-4 mb-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-blue-500 mb-2">{notification.title}</h2>
                <p className="text-lg">{notification.message}</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  Mark as Read
                </button>
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