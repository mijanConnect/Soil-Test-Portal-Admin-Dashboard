import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tooltip,
  Switch,
  message,
  Rate,
} from "antd";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import MarchantIcon from "../../assets/marchant.png";

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

const SalesRepsManagementTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      MarchantID: 55,
      name: "Alice Johnson",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "example@email.com",
      retailer: 5,
      sales: "$300",
      status: "Active",
      phone: "+1234567890",
      location: "New York",
      businessName: "Alice's Store",
      feedback: 4,
    },
    {
      id: 2,
      MarchantID: 59,
      name: "John Doe",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "john@email.com",
      retailer: 3,
      sales: "$500",
      status: "Inactive",
      phone: "+9876543210",
      location: "California",
      businessName: "John's Shop",
      feedback: 3,
    },
    {
      id: 3,
      MarchantID: 85,
      name: "Jane Smith",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "jane@email.com",
      retailer: 4,
      sales: "$700",
      status: "Active",
      phone: "+1112223333",
      location: "Texas",
      businessName: "Jane's Boutique",
      feedback: 5,
    },
  ]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const handleAddMerchant = () => {
    form
      .validateFields()
      .then((values) => {
        const newMerchant = {
          id: data.length + 1,
          ...values,
          sales: values.sales || "$0",
          status: values.status || "Inactive",
          image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
        };
        setData([...data, newMerchant]);
        setIsAddModalVisible(false);
        form.resetFields();
        message.success("New merchant added successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Export CSV
  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "Merchant Card ID",
      "Business Name",
      "Phone",
      "Email",
      "Location",
      "Sales Rep",
      "Total Sales",
      "Status",
    ];
    csvRows.push(headers.join(","));

    data.forEach((row) => {
      const values = [
        row.id,
        row.businessName,
        row.phone,
        row.email,
        row.location,
        row.name,
        row.sales,
        row.status,
      ];
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "merchants.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filter data
  const filteredData = data.filter(
    (item) =>
      item.MarchantID.toString().includes(searchText) ||
      item.businessName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Merchant Card ID",
      dataIndex: "MarchantID",
      key: "MarchantID",
      align: "center",
    },
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    { title: "Sales Rep", dataIndex: "name", key: "salesRep", align: "center" },
    { title: "Total Sales", dataIndex: "sales", key: "sales", align: "center" },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Ratings",
      dataIndex: "feedback",
      key: "feedback",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Customer Ratings">
          <Rate
            disabled
            value={record.feedback} // assuming rating is a number from 1 to 5
            style={{ fontSize: 16, color: "#FFD700" }} // optional styling
          />
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      with: 120,
      render: (_, record) => (
        <div
          className="flex gap-2 justify-between align-middle py-[7px] px-[15px] border border-primary rounded-md"
          style={{ alignItems: "center" }}
        >
          <Tooltip title="View Details">
            <button
              onClick={() => showViewModal(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <IoEyeSharp />
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
              backgroundColor: record.status === "Active" ? "#3fae6a" : "gray",
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

  // Columns for loyalty points / orders
  const columns2 = [
    {
      title: "SL",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Reward",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Points Used",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between md:flex-row flex-col md:items-end items-start gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold">Merchant Management</h1>
          <p className="text-[16px] font-normal mt-2">
            Effortlessly manage your merchants and track performance.
          </p>
        </div>

        <div className="flex md:flex-row flex-col items-start gap-2">
          <Input.Search
            placeholder="Search by ID, Business, Phone, Email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            className="bg-primary text-white hover:!text-black"
            onClick={() => setIsAddModalVisible(true)}
          >
            Add New Merchant
          </Button>
          <Button
            className="bg-primary text-white hover:!text-black"
            // onClick={exportToCSV}
          >
            Export
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

      {/* View Details Modal */}
      <Modal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={700}
        footer={[]}
      >
        {selectedRecord && (
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between gap-3 mt-8 mb-8">
              <img
                src={MarchantIcon}
                alt={selectedRecord.name}
                className="w-214 h-214 rounded-full"
              />
              <div className="flex flex-col gap-2 w-full border border-primary rounded-md p-4">
                <p className="text-[22px] font-bold text-primary">
                  Marchant Profile
                </p>
                <p>
                  <strong>Name:</strong> {selectedRecord.name}
                </p>
                <p>
                  <strong>Business Name:</strong> {selectedRecord.businessName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRecord.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedRecord.phone}
                </p>
                <p>
                  <strong>Location:</strong> {selectedRecord.location}
                </p>
                <p>
                  <strong>Total Sales:</strong> {selectedRecord.sales}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRecord.status}
                </p>
              </div>
            </div>
            <Table
              columns={columns2}
              dataSource={data}
              rowKey="orderId"
              pagination={{ pageSize: 5 }}
              className="mt-6"
            />
          </div>
        )}
      </Modal>

      {/* Add New Merchant Modal */}
      <Modal
        visible={isAddModalVisible}
        title="Add New Merchant"
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddMerchant}
        okText="Add Merchant"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="businessName"
            label="Business Name"
            rules={[{ required: true, message: "Please enter business name" }]}
          >
            <Input placeholder="Enter business name" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Sales Rep"
            rules={[{ required: true, message: "Please enter sales rep name" }]}
          >
            <Input placeholder="Enter sales rep name" />
          </Form.Item>
          <Form.Item
            name="sales"
            label="Total Sales"
            rules={[{ required: true, message: "Please enter total sales" }]}
          >
            <Input placeholder="Enter sales (e.g. $500)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesRepsManagementTable;
