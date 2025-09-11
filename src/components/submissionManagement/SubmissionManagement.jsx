import React, { useState } from "react";
import { Table, Button, Modal, Input, Tooltip, Switch } from "antd";
import { FaTrash } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { Document, Page, pdfjs } from "react-pdf";
// Set the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import SoilTestReport from "../../../src/assets/soil-test-report.jpg";

const SubmissionManagement = () => {
  const [activeTab, setActiveTab] = useState("myDocuments");
  const [numPages, setNumPages] = useState(null);

  const [myDocuments, setMyDocuments] = useState([
    {
      id: 1,
      title: "Quantum-Entangled Communication",
      email: "alice@email.com",
      category: "Soil Test",
      date: "2025-08-01",
      status: "Active",
      fileUrl: "/assets/dummy-pdf_2.pdf", // ✅ Use string path
    },
    {
      id: 2,
      title: "Quantum-Entangled Communication",
      email: "alice@email.com",
      category: "Soil Test",
      date: "2025-08-05",
      status: "Inactive",
      fileUrl: SoilTestReport,
    },
    {
      id: 3,
      title: "Soil Fertility Report",
      email: "bob@email.com",
      category: "Agriculture",
      date: "2025-08-10",
      status: "Active",
      fileUrl: "/assets/sample1.pdf",
    },
    {
      id: 4,
      title: "Groundwater Quality Analysis",
      email: "carol@email.com",
      category: "Water Test",
      date: "2025-08-12",
      status: "Inactive",
      fileUrl: "/assets/sample2.pdf",
    },
    {
      id: 5,
      title: "Crop Yield Prediction Report",
      email: "david@email.com",
      category: "Research",
      date: "2025-08-15",
      status: "Active",
      fileUrl: "/assets/sample3.pdf",
    },
  ]);

  const [userDocuments, setUserDocuments] = useState([
    {
      id: 1,
      title: "Quantum-Entangled Communication",
      email: "john@email.com",
      category: "Soil Test",
      date: "2025-08-02",
      status: "Active",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 2,
      title: "User Doc 2",
      email: "john@email.com",
      category: "Marketing",
      date: "2025-08-06",
      status: "Inactive",
      fileUrl: SoilTestReport,
    },
    {
      id: 3,
      title: "Soil Nutrient Analysis",
      email: "emma@email.com",
      category: "Agriculture",
      date: "2025-08-08",
      status: "Active",
      fileUrl: "https://www.africau.edu/images/default/sample.pdf",
    },
    {
      id: 4,
      title: "Pesticide Residue Report",
      email: "liam@email.com",
      category: "Environmental Test",
      date: "2025-08-11",
      status: "Inactive",
      fileUrl: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
    },
  ]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
    setNumPages(null);
  };

  const currentData =
    activeTab === "myDocuments"
      ? myDocuments.filter(
          (doc) =>
            doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
            doc.email.toLowerCase().includes(searchText.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchText.toLowerCase())
        )
      : userDocuments.filter(
          (doc) =>
            doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
            doc.email.toLowerCase().includes(searchText.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchText.toLowerCase())
        );

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    { title: "Title", dataIndex: "title", key: "title", align: "center" },
    { title: "User E-mail", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    { title: "Date", dataIndex: "date", key: "date", align: "center" },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => (
        <div
          className="flex gap-4 justify-between align-middle py-[3px] px-[15px] border border-primary rounded-md"
          style={{ alignItems: "center" }}
        >
          {/* View Button */}
          <Tooltip title="View Document">
            <button
              onClick={() => showViewModal(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <EyeOutlined />
            </button>
          </Tooltip>

          {/* Delete Button */}
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
                    const updateFunc =
                      activeTab === "myDocuments"
                        ? setMyDocuments
                        : setUserDocuments;

                    updateFunc((prev) =>
                      prev.filter((item) => item.id !== record.id)
                    );

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

          {/* Status Toggle */}
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
                  const updateFunc =
                    activeTab === "myDocuments"
                      ? setMyDocuments
                      : setUserDocuments;

                  updateFunc((prev) =>
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
      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex gap-3">
          <Button
            type="primary"
            onClick={() => setActiveTab("myDocuments")}
            className={`px-[50px] py-[20px] rounded-lg text-[16px] font-medium 
      ${
        activeTab === "myDocuments"
          ? "bg-primary !text-white border-primary"
          : "bg-white !text-secondary border-primary hover:bg-primary hover:!text-white"
      }`}
          >
            My Documents
          </Button>

          <Button
            type="primary"
            onClick={() => setActiveTab("userDocuments")}
            className={`px-[50px] py-[20px] rounded-lg text-[16px] font-medium 
      ${
        activeTab === "userDocuments"
          ? "bg-primary !text-white border-primary"
          : "bg-white !text-secondary border-primary hover:bg-primary hover:!text-white"
      }`}
          >
            User's Documents
          </Button>
        </div>

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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={currentData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* View Modal */}
      <Modal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={1000}
        footer={null}
      >
        {selectedRecord?.fileUrl && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{selectedRecord.title}</h3>
              <a
                href={selectedRecord.fileUrl}
                download
                className="py-1 border border-primary bg-primary hover:bg-white text-white hover:text-primary hover:border hover:border-primary transition px-8 rounded"
              >
                Download
              </a>
            </div>
            {selectedRecord.fileUrl.endsWith(".pdf") ? (
              <div
                style={{ height: "600px", overflow: "auto" }}
                className="border border-primary mt-4 rounded-lg p-4"
              >
                <Document
                  file={selectedRecord.fileUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={760}
                    />
                  ))}
                </Document>
              </div>
            ) : (
              <div className="border border-primary mt-4 rounded-lg p-4">
                <img
                  src={selectedRecord.fileUrl}
                  alt={selectedRecord.title}
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionManagement;
