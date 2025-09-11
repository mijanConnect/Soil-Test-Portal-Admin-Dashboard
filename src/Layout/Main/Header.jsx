import React, { useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Button, Dropdown, Menu, Modal, List } from "antd";
import { IoIosLogOut } from "react-icons/io";
import Avatar from "../../assets/avatar.png";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, isMobile }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const navigate = useNavigate();

  const showLogoutConfirm = () => setIsLogoutModalOpen(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogoutModalOpen(false);
    window.location.href = "/auth/login";
  };

  const handleOpenNotification = () => {
    setIsNotificationModalOpen(true);
  };

  const handleCloseNotification = () => {
    setIsNotificationModalOpen(false);
  };

  const handleSeeAllNotifications = () => {
    setIsNotificationModalOpen(false);
    navigate("/notification");
  };

  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <Link to="/profile">Settings</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        danger
        onClick={showLogoutConfirm}
        style={{ display: "flex", alignItems: "center" }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  // Dummy notifications (you can replace with API data later)
  const notifications = [
    { id: 1, text: "New user registered" },
    { id: 2, text: "Payment received successfully" },
    { id: 3, text: "Server maintenance scheduled" },
    { id: 4, text: "New promotion campaign launched" },
  ];

  return (
    <div className="flex items-center justify-between gap-5 w-full px-4 rounded-md lg:px-10 shadow-sm py-4">
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button (Mobile Only) */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-xl text-gray-700 p-2 rounded-md hover:bg-gray-100"
          >
            &#9776; {/* hamburger icon */}
          </button>
        )}
        {/* <h2 className="font-bold text-xl text-secondary">
          Super Admin Dashboard
        </h2> */}
      </div>

      <div className="flex items-center gap-5">
        {/* Profile Icon with Dropdown Menu */}
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex flex-row gap-1">
              <p>Hello,</p>
              <p className="text-[16px] font-semibold">Sabbir</p>
            </div>
            <img
              style={{
                clipPath: "circle()",
                width: 45,
                height: 45,
              }}
              src={Avatar}
              alt="profile-pic"
              className="clip"
            />
          </div>
        </Dropdown>

        {/* Notification Icon */}
        <div
          onClick={handleOpenNotification}
          className="h-fit mt-[10px] cursor-pointer"
        >
          <Badge count={notifications.length} backgroundcolor="#071952">
            <FaRegBell color="#071952" size={24} />
          </Badge>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onCancel={handleCancelLogout}
        footer={[
          <Button key="cancel" onClick={handleCancelLogout}>
            Cancel
          </Button>,
          <Button key="logout" danger onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>

      {/* Notification Modal */}
      <Modal
        title="Notifications"
        open={isNotificationModalOpen}
        onCancel={handleCloseNotification}
        footer={[
          <Button
            key="seeAll"
            type="primary"
            onClick={handleSeeAllNotifications}
          >
            See All Notifications
          </Button>,
        ]}
      >
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <span>{item.text}</span>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default Header;
