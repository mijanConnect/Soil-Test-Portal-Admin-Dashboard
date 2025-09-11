import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tooltip,
  Switch,
  Select,
} from "antd";
import { FaTrash } from "react-icons/fa";
import { EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

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

const CategoryManagement = () => {
  const [data, setData] = useState([
    {
      id: 1,
      categoryName: "Soil Analysis",
      submission: "50",
      createdAt: "2025-08-01",
      status: "Active",
    },
    {
      id: 2,
      categoryName: "Water Quality",
      submission: "32",
      createdAt: "2025-08-03",
      status: "Inactive",
    },
    {
      id: 3,
      categoryName: "Fertilizer Testing",
      submission: "75",
      createdAt: "2025-08-05",
      status: "Active",
    },
    {
      id: 4,
      categoryName: "Crop Disease",
      submission: "20",
      createdAt: "2025-08-07",
      status: "Active",
    },
    {
      id: 5,
      categoryName: "Pesticide Residue",
      submission: "44",
      createdAt: "2025-08-09",
      status: "Inactive",
    },
    {
      id: 6,
      categoryName: "Nutrient Deficiency",
      submission: "61",
      createdAt: "2025-08-11",
      status: "Active",
    },
    {
      id: 7,
      categoryName: "Compost Quality",
      submission: "29",
      createdAt: "2025-08-13",
      status: "Inactive",
    },
    {
      id: 8,
      categoryName: "Soil pH Testing",
      submission: "58",
      createdAt: "2025-08-15",
      status: "Active",
    },
  ]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // View/Edit Modal
  const showViewModal = (record) => {
    setSelectedRecord(record);
    viewForm.setFieldsValue(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const handleUpdateRecord = () => {
    viewForm.validateFields().then((values) => {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id ? { ...item, ...values } : item
        )
      );
      Swal.fire({
        title: "Updated!",
        text: "Category details have been updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsViewModalVisible(false);
    });
  };

  // Add New Category
  const handleAddCategory = () => {
    addForm.validateFields().then((values) => {
      const newCategory = {
        id: data.length + 1,
        status: "Active",
        ...values,
      };
      setData((prev) => [...prev, newCategory]);
      Swal.fire({
        title: "Category Added!",
        text: `Category "${values.categoryName}" has been added successfully.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      addForm.resetFields();
      setIsAddModalVisible(false);
    });
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      align: "center",
    },
    {
      title: "Submission",
      dataIndex: "submission",
      key: "submission",
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => (
        <div
          className="flex gap-4 justify-between align-middle py-[3px] px-[15px] border border-primary rounded-md"
          style={{ alignItems: "center" }}
        >
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
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    setData(data.filter((item) => item.id !== record.id));
                    Swal.fire({
                      title: "Deleted!",
                      text: "Your record has been deleted.",
                      icon: "success",
                    });
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
            checked={record.status === "Active"}
            style={{
              backgroundColor: record.status === "Active" ? "#48B14C" : "gray",
            }}
            onChange={(checked) => {
              Swal.fire({
                title: "Are you sure?",
                text: `You are about to change status to ${
                  checked ? "Active" : "Inactive"
                }.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, change it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  setData((prev) =>
                    prev.map((item) =>
                      item.id === record.id
                        ? { ...item, status: checked ? "Active" : "Inactive" }
                        : item
                    )
                  );
                  Swal.fire({
                    title: "Updated!",
                    text: `Status has been changed to ${
                      checked ? "Active" : "Inactive"
                    }.`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }
              });
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
        <div className="!w-[400px]">
          <Input.Search
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            enterButton
            className="custom-search"
          />
        </div>
        <div className="">
          <Button
            type="primary"
            onClick={() => setIsAddModalVisible(true)}
            className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
          >
            Add New Category
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* View/Edit Modal */}
      <Modal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={500}
        onOk={handleUpdateRecord}
        okText="Save Changes"
      >
        {selectedRecord && (
          <div className="flex flex-col gap-2 w-full rounded-md mb-8">
            <p className="text-[22px] font-bold">Edit Category</p>
            <Form
              form={viewForm}
              layout="vertical"
              className="flex flex-col space-y-6 mb-6"
            >
              <Form.Item
                name="categoryName"
                label={<span className="custom-label-ant">Category Name</span>}
                className="custom-form-item-ant"
                rules={[
                  { required: true, message: "Please enter category name" },
                ]}
              >
                <Input
                  placeholder="Enter category name"
                  className="custom-input-ant-modal w-full"
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Add New Category Modal */}
      <Modal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddCategory}
        okText="Add Category"
        width={500}
      >
        <div className="flex flex-col gap-2 w-full rounded-md mb-8">
          <p className="text-[22px] font-bold">Add New Category</p>
          <Form
            form={addForm}
            layout="vertical"
            className="flex flex-col space-y-6 mb-6"
          >
            <Form.Item
              name="categoryName"
              label={<span className="custom-label-ant">Category Name</span>}
              className="custom-form-item-ant"
              rules={[
                { required: true, message: "Please enter category name" },
              ]}
            >
              <Input
                placeholder="Enter category name"
                className="custom-input-ant-modal w-full"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
