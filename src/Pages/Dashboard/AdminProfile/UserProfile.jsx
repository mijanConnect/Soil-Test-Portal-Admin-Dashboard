import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  notification,
  Upload,
  Avatar,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../../redux/apiSlices/authSlice";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { getImageUrl } from "../../../components/common/imageUrl";
const { Option } = Select;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]); // State to handle file list
  const { data, isLoading: profileLoading } = useProfileQuery();
  const [profile, { isLoading, error }] = useUpdateProfileMutation();

  // Dummy data (to be used as the default data)
  const userInformation = data?.data;
  useEffect(() => {
    // Set initial values
    form.setFieldsValue(userInformation);

    // Set profile image if exists
    if (userInformation?.profile || userInformation?.image) {
      const fullImageUrl = getImageUrl(
        userInformation?.profile || userInformation?.image
      );
      setImageUrl(fullImageUrl);
      setFileList([
        {
          uid: "-1",
          name: "profile.jpg",
          status: "done",
          url: fullImageUrl,
        },
      ]);
    }
  }, [form, userInformation]);

  // Clean up blob URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);
  if (profileLoading) {
    return <Loader />;
  }

  const onFinish = async (values) => {
    try {
      const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
      const formData = new FormData();
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      if (imageFile) formData.append("image", imageFile);

      const res = await profile(formData);
      console.log(res);
      if (res?.data?.success) {
        toast.success(res.data?.message || "Profile updated successfully");
      } else {
        toast.error(res.data?.message || "Profile updated failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Profile updated failed");
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    // Only keep the most recent file in the list
    const limitedFileList = newFileList.slice(-1);
    setFileList(limitedFileList);

    if (limitedFileList.length > 0 && limitedFileList[0].originFileObj) {
      // Create blob URL for preview
      const newImageUrl = URL.createObjectURL(limitedFileList[0].originFileObj);

      // Clean up previous blob URL if exists
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }

      setImageUrl(newImageUrl);
    } else {
      setImageUrl(null);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      notification.error({
        message: "Invalid File Type",
        description: "Please upload an image file.",
      });
    }

    // Check file size (optional)
    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      notification.error({
        message: "File too large",
        description: "Image must be smaller than 2MB.",
      });
    }

    return isImage && isLessThan2MB;
  };

  const handleFormSubmit = () => {
    form.submit(); // This will trigger the onFinish function
  };

  return (
    <div className="flex justify-center items-center shadow-xl rounded-lg pt-5 pb-12">
      <Form
        form={form}
        layout="vertical"
        style={{ width: "80%" }}
        onFinish={onFinish}
        encType="multipart/form-data"
      >
        <div className="flex flex-col gap-5">
          {/* Profile Image */}
          <div className="col-span-2 flex justify-start items-center gap-5">
            <Form.Item style={{ marginBottom: 0 }}>
              <Upload
                name="avatar"
                showUploadList={false}
                action="/upload" // This will be overridden by the manual form submission
                onChange={handleImageChange}
                beforeUpload={beforeUpload}
                fileList={fileList}
                listType="picture-card"
                maxCount={1}
              >
                {imageUrl ? (
                  <Avatar size={100} src={imageUrl} />
                ) : (
                  <Avatar size={100} icon={<UploadOutlined />} />
                )}
              </Upload>
            </Form.Item>
            <h2 className="text-[24px] font-bold">{userInformation?.name}</h2>
          </div>

          {/* Username */}
          <Form.Item
            name="name"
            label="Full Name"
            style={{ marginBottom: 0 }}
            initialValue={userInformation?.name}
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              placeholder="Enter your Username"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* Email (Disabled) */}
          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 0 }}
            initialValue={userInformation?.email}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="Enter your Email"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                // border: "1px solid #E0E4EC",
                outline: "none",
              }}
              disabled // Disable the email field
            />
          </Form.Item>

          <Form.Item
            name="contact"
            label="Contact Number"
            style={{ marginBottom: 0 }}
            initialValue={userInformation?.contact}
            rules={[{ required: true, message: "Please enter your contact" }]}
          >
            <Input
              placeholder="Enter your contact"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* Update Profile Button */}
          <div className="col-span-2 text-end mt-6">
            <Form.Item>
              {/* Option 1: Use standard Ant Design Button */}
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: 40 }}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserProfile;
