const NotificationList = ({ notifications }) => {
    return (
      <div>
        {notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <p>{notification.title}</p>
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
    );
  };
  
  export default NotificationList;