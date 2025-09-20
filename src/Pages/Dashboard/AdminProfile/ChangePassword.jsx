import { Button, Form, Input } from "antd";
import React from "react";
import { useChangePasswordMutation } from "../../../redux/apiSlices/authSlice";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [updatePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async (values) => {
    console.log(values); // { currentPassword, newPassword, confirmPassword }
    try {
      const res = await updatePassword(values);
      console.log(res);
      if (res?.data?.success) {
        toast.success(res?.data?.message || "Password updated successfully");
        form.resetFields(); // reset form after success
      } else {
        toast.error(res?.data?.message || "Password update failed");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-start pl-20 pr-20 pt-5 pb-10 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">Update Password</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          {/* Current Password */}
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Please input your current password!" }]}
          >
            <Input.Password
              placeholder="Enter Current Password"
              style={{
                height: "40px",
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* New Password */}
          <Form.Item
            name="newPassword"
            label="New Password"
            dependencies={["currentPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Please input your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("currentPassword") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("New password cannot be the same as current password!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Enter New Password"
              style={{
                height: "40px",
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            label="Re-Type Password"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Re-enter New Password"
              style={{
                height: "40px",
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* Submit Button */}
          <div className="flex justify-center mb-[20px] w-full">
            <Button type="primary" htmlType="submit" block style={{ height: 40 }}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
