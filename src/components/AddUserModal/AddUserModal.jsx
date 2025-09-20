import React, { useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import Swal from "sweetalert2";
import { useCreateUserAsAdminMutation } from "../../redux/apiSlices/dashboardSlice";

const { Option } = Select;

// AddUserModal component - separate modal for adding a new user
const AddUserModal = ({ isVisible, onClose, onUserAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [createUserAsAdmin, { isLoading: isCreatingUser }] =
    useCreateUserAsAdminMutation();
  // Function to handle adding user
  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = await createUserAsAdmin(values);
      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: "User has been added successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to add user.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      form.resetFields();
      onUserAdded?.();
      onClose();
      setLoading(false);
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      title="Add New User"
      okText="Add User"
      onOk={handleAddUser}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Contact"
          name="contact"
          rules={[{ required: true, message: "Please enter contact number" }]}
        >
          <Input placeholder="Enter contact" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role">
            <Option value="USER">USER</Option>
            <Option value="ADMIN">ADMIN</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
