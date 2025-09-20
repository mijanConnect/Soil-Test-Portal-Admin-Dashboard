import { Menu, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import {
  Settings,
  People,
  FileIcon,
  UploadIcon,
  CategoryIcon,
} from "../../components/common/Svg";
import image4 from "../../assets/image4.png";
import { useUser } from "../../provider/User";

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const showLogoutConfirm = () => setIsLogoutModalOpen(true);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };
  const handleCancel = () => setIsLogoutModalOpen(false);

  const isItemActive = (itemKey) =>
    selectedKey === itemKey ||
    (itemKey === "subMenuSetting" &&
      ["/profile", "/terms-and-conditions", "/privacy-policy"].includes(
        selectedKey
      ));

  const renderIcon = (IconComponent, itemKey) => {
    const isActive = isItemActive(itemKey);
    return (
      <div
        style={{ width: 20, height: 20 }}
        className={isActive ? "svg-active" : ""}
      >
        <IconComponent
          className="menu-icon"
          fill={isActive ? "#ffffff" : "#1E1E1E"}
        />
      </div>
    );
  };

  const rawMenuItems = [
    {
      key: "/submission-management",
      icon: renderIcon(FileIcon, "/submission-management"),
      label: (
        <Link to="/submission-management">
          {collapsed ? "" : "Submission Management"}
        </Link>
      ),
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "/user-management",
      icon: renderIcon(People, "/user-management"),
      label: (
        <Link to="/user-management">{collapsed ? "" : "User Management"}</Link>
      ),
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "/upload-documents",
      icon: renderIcon(UploadIcon, "/upload-documents"),
      label: (
        <Link to="/upload-documents">
          {collapsed ? "" : "Upload New Documents"}
        </Link>
      ),
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "/category-management",
      icon: renderIcon(CategoryIcon, "/category-management"),
      label: (
        <Link to="/category-management">
          {collapsed ? "" : "Category Management"}
        </Link>
      ),
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "subMenuSetting",
      icon: renderIcon(Settings, "subMenuSetting"),
      label: collapsed ? "" : "Settings",
      roles: ["SUPER_ADMIN"],
      children: [
        {
          key: "/profile",
          label: <Link to="/profile">{collapsed ? "" : "Update Profile"}</Link>,
        },
        {
          key: "/terms-and-conditions",
          label: (
            <Link to="/terms-and-conditions">
              {collapsed ? "" : "Terms & Conditions"}
            </Link>
          ),
        },
        {
          key: "/privacy-policy",
          label: (
            <Link to="/privacy-policy">
              {collapsed ? "" : "Privacy Policy"}
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={showLogoutConfirm}>{collapsed ? "" : "Logout"}</p>,
      roles: ["SUPER_ADMIN"],
    },
  ];

  const menuItems = rawMenuItems.filter(
    (item) => !item.role || item.role.includes(user?.role)
  );

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path ||
        (item.children && item.children.some((sub) => sub.key === path))
    );
    if (selectedItem) {
      setSelectedKey(path);
      if (selectedItem.children) setOpenKeys([selectedItem.key]);
      else {
        const parentItem = menuItems.find(
          (item) =>
            item.children && item.children.some((sub) => sub.key === path)
        );
        if (parentItem) setOpenKeys([parentItem.key]);
      }
    }
  }, [path, menuItems]);

  return (
    <div
      className={`h-full flex flex-col bg-white transition-all duration-300 z-40 ${
        isMobile
          ? `fixed top-0 left-0 w-64 h-full shadow-lg transform ${
              collapsed ? "-translate-x-full" : "translate-x-0"
            }`
          : ""
      }`}
      style={{ width: collapsed && !isMobile ? 80 : 250 }}
    >
      {/* Logo */}
      {!collapsed &&
        // <Link
        //   to={"/"}
        (
          <div className="logo-container flex items-center justify-center py-4">
            <img src={image4} alt="logo" className="w-40 h-40" />
          </div>
        )
      }

      {/* Menu */}
      <div className="flex-1 overflow-y-auto mt-6">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed && !isMobile}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          className="font-poppins text-black border-none"
          items={menuItems.map((item) => ({
            ...item,
            children: item.children
              ? item.children.map((subItem) => ({ ...subItem }))
              : undefined,
          }))}
        />
      </div>

      {/* Logout Modal */}
      <Modal
        centered
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default Sidebar;
