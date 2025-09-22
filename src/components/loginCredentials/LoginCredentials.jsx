import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tooltip,
  Switch,
  Row,
  Col,
  Select,
  Spin,
} from "antd";
import { FaTrash } from "react-icons/fa";
import { EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
  useUpdateUserMutation,
} from "../../redux/apiSlices/dashboardSlice";
import AddUserModal from "../AddUserModal/AddUserModal";

const { Option } = Select;

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

// Main LoginCredentials Component
const LoginCredentials = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  // Fetch users
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllUserQuery({ page, limit, search: searchText });

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchText]);

  const allUsers = usersResponse?.data || [];
  const paginationData = usersResponse?.pagination || { total: 0 };

  // Modal & Form states for edit/view
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewForm] = Form.useForm();
  const showViewModal = (record) => {
    setSelectedRecord(record);
    viewForm.setFieldsValue(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const handleUpdateRecord = async () => {
    try {
      const values = await viewForm.validateFields();
      const payload = { ...values, id: selectedRecord._id };

      if (typeof payload !== "object") {
        throw new Error("Payload is not an object");
      }

      const res = await updateUser(payload);

      if (res.data.success) {
        Swal.fire({
          title: "Updated!",
          text: "User details have been updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsViewModalVisible(false);
        refetch();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update user.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  const deleteUserFromRecord = async (record) => {
    try {
      const payload = {
        id: record._id,
      };
      const res = await deleteUser(payload);
      if (res.data.success) {
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete user.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const updateUserStatus = async (record) => {
    try {
      if (!record || !record._id) {
        throw new Error("User record is missing or invalid");
      }

      // Toggle the current status
      const payload = {
        id: record._id,
        isDeleted: !record.isDeleted,
      };

      const res = await updateUser(payload);

      if (res?.data?.success) {
        Swal.fire({
          title: "Updated!",
          text: `Status has been changed successfully.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to change status.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "SL",
      key: "index",
      align: "center",
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    { title: "User Name", dataIndex: "name", key: "name", align: "center" },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Phone Number",
      dataIndex: "contact",
      key: "contact",
      align: "center",
    },
    { title: "Role", dataIndex: "role", key: "role", align: "center" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 140,
      render: (_, record) => (
        <div className="flex gap-4 justify-between items-center py-[3px] px-[15px] border border-primary rounded-md">
          <Tooltip title="View & Update Details">
            <button
              onClick={() => showViewModal(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <EditOutlined />
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              onClick={({}) => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to delete this user!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    // need to delete user function
                    deleteUserFromRecord(record);
                  }
                });
              }}
              className="text-red-500 hover:text-red-700 text-md"
            >
              <FaTrash />
            </button>
          </Tooltip>

          <Switch
            size="small"
            checked={!record.isDeleted}
            onChange={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to change this user status!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, change it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  updateUserStatus(record);
                }
              });
            }}
            style={{
              backgroundColor: !record.isDeleted ? "#48B14C" : "gray",
            }}
          />
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Spin size="large" />
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500">Failed to load users.</div>;

  return (
    <div>
      {/* Search & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
        <div className="!w-[400px]">
          <Input.Search
            placeholder="Search by name/email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            enterButton
            className="custom-search"
          />
        </div>
        <div className="flex gap-5">
          <Button
            type="primary"
            className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
            onClick={() => setIsUserModalVisible(true)}
          >
            Add New User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={allUsers}
          columns={columns}
          pagination={{
            current: page, // Set current page from state
            pageSize: limit, // Set page size (limit) from state
            total: paginationData.total, // Get the total from API response
            onChange: (page, pageSize) => {
              setPage(page); // Update the page state when the page changes
              setLimit(pageSize); // Update the pageSize (limit) if user changes it
            },
          }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* View/Edit User Modal */}
      <Modal
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={700}
        onOk={handleUpdateRecord}
        confirmLoading={isUpdatingUser}
        okText="Save Changes"
      >
        {selectedRecord && (
          <div className="flex flex-col gap-2 w-full rounded-md mb-8">
            <p className="text-[22px] font-bold">Edit User</p>
            <Form form={viewForm} layout="vertical" className="mb-4">
              <Row gutter={[30, 20]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="name" label="User Name">
                    <Input placeholder="Enter User Name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="email" label="Email">
                    <Input placeholder="Enter Email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[30, 20]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="contact" label="Contact">
                    <Input placeholder="Enter Contact" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  {/* need to add role */}
                  <Form.Item name="role" label="Role">
                    <Select placeholder="Select Role">
                      <Option value="USER">USER</Option>
                      <Option value="ADMIN">ADMIN</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <AddUserModal
        isVisible={isUserModalVisible}
        onClose={() => setIsUserModalVisible(false)}
        onUserAdded={refetch}
      />
    </div>
  );
};

export default LoginCredentials;
