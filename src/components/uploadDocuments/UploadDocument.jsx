import React, { useState } from "react";
import { Form, Input, Button, Select, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateDocumentMutation } from "../../redux/apiSlices/documentSlice";
import toast from "react-hot-toast";
import {
  useGetAllCategoryForSuperAdminQuery,
  useGetAllCategoryQuery,
} from "../../redux/apiSlices/categorySlice";

const { Option } = Select;
const { TextArea } = Input;

const UploadDocument = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  // create document api call
  const [createDocument, { isLoading, error }] = useCreateDocumentMutation();
  // all category api call
  const { data: allCategories, isLoading: categoryLoading } =
    useGetAllCategoryForSuperAdminQuery();
  if (categoryLoading) return <Spin size="large" />;

  const categories = allCategories?.data;
  // handle file change
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // submit document
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("sortDescription", values.sortDescription);
      formData.append("category", values.category);
      formData.append("detailDescription", values.detailDescription);
      formData.append(
        "files",
        fileList.map((file) => file.name)
      );
      await createDocument(formData);
      toast.success("Document uploaded successfully!");
      form.resetFields();
      setFileList([]);
    } catch (error) {
      toast.error("Failed to upload document");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 rounded-md shadow-sm bg-white">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <div className="border-2 border-primary p-12 rounded-lg">
          <div className="flex gap-6">
            {/* Left side */}
            <div className="flex-1 flex flex-col space-y-6">
              <Form.Item
                label="Title"
                name="title"
                className="custom-form-item-ant"
                rules={[
                  {
                    required: true,
                    message: "Please enter the document title",
                  },
                ]}
              >
                <Input
                  placeholder="Enter document title"
                  className="custom-input-ant-modal w-full"
                />
              </Form.Item>

              <Form.Item
                label="Short Description"
                name="shortDescription"
                className="custom-form-item-ant"
                rules={[
                  {
                    required: true,
                    message: "Please enter a short description",
                  },
                ]}
              >
                <Input
                  placeholder="Enter a brief description"
                  className="custom-input-ant-modal w-full"
                />
              </Form.Item>
            </div>

            {/* Right side */}
            <div className="flex-1 flex flex-col space-y-6">
              <Form.Item
                label="Category"
                name="category"
                className="custom-form-item-ant-select"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select
                  placeholder="Select category"
                  className="custom-select-ant-modal w-full"
                >
                  {categories?.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="File upload (PDF/images)"
                name="file"
                className="custom-form-item-ant"
                rules={[{ required: true, message: "Please upload a file" }]}
              >
                <Upload
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="w-full"
                  style={{ width: "100%" }} // ensures wrapper is full width
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="custom-input-ant-modal w-full"
                    style={{ width: "100%" }} // ensures button itself is full width
                  >
                    Choose File
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </div>

          {/* Detailed Description */}
          <Form.Item
            label="Detailed Description"
            name="detailedDescription"
            className="custom-form-item-ant mt-6"
            rules={[
              { required: true, message: "Please enter detailed description" },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Enter detailed description here..."
              className="custom-input-ant-modal"
              style={{ minHeight: 140 }} // fallback height
            />
          </Form.Item>
        </div>

        {/* Submit Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            className="w-full mt-4 bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UploadDocument;
