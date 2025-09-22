import React, { useState } from "react";
import { Table, Button, Modal, Input, Tooltip, Switch, Spin } from "antd";
import { FaTrash } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { Document, Page, pdfjs } from "react-pdf";
import {
  useGetAllDocumentsQuery,
  useGetDocumentForAdminQuery,
  useUpdateDocumentStatusMutation,
  useDeleteDocumentMutation,
} from "../../redux/apiSlices/documentSlice";
import { useProfileQuery } from "../../redux/apiSlices/authSlice";

// PDF worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SubmissionManagement = () => {
  // Local state for pagination
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Local state for searchText
  const [searchText, setSearchText] = useState(""); // Initialize searchText

  // API calls
  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchAdmin,
  } = useGetAllDocumentsQuery();
  
  const { data: profileData, isLoading: profileLoading } = useProfileQuery();
  
  const {
    data: adminData,
    isLoading: adminLoading,
    isFetching: adminFetching,
    refetch: refetchAdminData,
  } = useGetDocumentForAdminQuery({
    page: pagination.current || 1, // Fallback to 1 if pagination is not initialized
    limit: pagination.pageSize || 10, // Fallback to 10 if pagination is not initialized
    search: searchText || "", // Ensure searchText is always a valid string
  });

  const [deleteDocument, { isLoading: deleteLoading }] = useDeleteDocumentMutation();
  const [updateDocumentStatus, { isLoading: updateLoading }] = useUpdateDocumentStatusMutation();

  // Local state
  const [activeTab, setActiveTab] = useState("myDocuments");
  const [numPages, setNumPages] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Show loader while initial data loading
  if (isLoading || profileLoading || adminLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Loading documents..." />
      </div>
    );
  }

  const myDocument = data?.data || [];
  const allDocument = adminData?.data || [];

  // Filter data by search
  const currentData =
    activeTab === "myDocuments"
      ? myDocument.filter(
          (doc) =>
            doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
            doc.user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            (doc.category?.title || "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
        )
      : allDocument.filter(
          (doc) =>
            doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
            doc.user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            (doc.category?.title || "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
        );

  // Modal handlers
  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
    setNumPages(null);
  };

  // Status update handler
  const handleUpdateDocumentStatus = async (record, checked) => {
    try {
      await updateDocumentStatus({
        id: record._id,
        isActive: checked,
      }).unwrap();
      Swal.fire({
        title: "Updated!",
        text: `Document status changed to ${checked ? "Active" : "Inactive"}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      activeTab === "myDocuments" ? refetchAdmin() : refetchAdminData();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to update document status",
        icon: "error",
      });
    }
  };

  // Delete handler
  const handleDeleteDocument = async (record) => {
    if (!record?._id) return;
    try {
      await deleteDocument(record._id).unwrap();
      Swal.fire({
        title: "Deleted!",
        text: "Document has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      activeTab === "myDocuments" ? refetchAdmin() : refetchAdminData();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete document",
        icon: "error",
      });
    }
  };

  // Table columns
  const columns = [
    {
      title: "SL",
      key: "index",
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Title", dataIndex: "title", key: "title", align: "center" },
    {
      title: "User",
      key: "user",
      align: "center",
      render: (record) => record.user?.name || "-",
    },
    {
      title: "Category",
      key: "category",
      align: "center",
      render: (record) => record.category?.title || "-",
    },
    {
      title: "Short Description",
      dataIndex: "sortDescription",
      key: "sortDescription",
      align: "center",
    },
    {
      title: "Detail Description",
      dataIndex: "detailDescription",
      key: "detailDescription",
      align: "center",
    },
    {
      title: "Documents",
      key: "document",
      align: "center",
      render: (record) => (
        <div className="flex flex-col gap-2">
          {record.document?.map((doc, idx) => (
            <a
              key={idx}
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {doc.endsWith(".pdf")
                ? `PDF File ${idx + 1}`
                : `Image ${idx + 1}`}
            </a>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      align: "center",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 150,
      render: (record) => (
        <div className="flex gap-4 justify-center items-center">
          {/* View */}
          <Tooltip title="View Document">
            <button
              onClick={() => showViewModal(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <EyeOutlined />
            </button>
          </Tooltip>

          {/* Delete */}
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
                  if (result.isConfirmed) handleDeleteDocument(record);
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
            checked={record.isActive}
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
                if (result.isConfirmed)
                  handleUpdateDocumentStatus(record, checked);
              });
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex gap-3">
          <Button
            type="primary"
            onClick={() => setActiveTab("myDocuments")}
            className={`px-[50px] py-[20px] rounded-lg text-[16px] font-medium ${
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
            className={`px-[50px] py-[20px] rounded-lg text-[16px] font-medium ${
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
          />
        </div>
      </div>

      {/* Table */}
      <Table
        dataSource={currentData}
        columns={columns}
        pagination={{
          ...pagination,
          total: adminData?.total, // Add total count for paginated data
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
        rowKey={(record) => record._id}
        size="small"
        loading={isFetching || adminFetching || deleteLoading || updateLoading}
        scroll={{ x: "max-content", y: 500 }}
        sticky
        className="custom-table"
      />

      {/* View Modal */}
      <Modal
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={900}
        footer={null}
        centered
        destroyOnClose
        closeIcon={<span className="text-white text-2xl font-bold">×</span>}
      >
        {selectedRecord && (
          <div className="flex flex-col">
            <div className="bg-primary text-white flex justify-between items-center px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedRecord.title}</h2>
                <p className="text-sm mt-1">
                  <strong>User:</strong> {selectedRecord.user?.name} |{" "}
                  <strong>Category:</strong> {selectedRecord.category?.title}
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-b border-gray-200">
              {selectedRecord.sortDescription && (
                <p className="text-gray-700 mb-2">
                  <strong>Short Description:</strong>{" "}
                  {selectedRecord.sortDescription}
                </p>
              )}
              {selectedRecord.detailDescription && (
                <p className="text-gray-800">
                  <strong>Detail Description:</strong>{" "}
                  {selectedRecord.detailDescription}
                </p>
              )}
            </div>

            <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto bg-white">
              {selectedRecord.document?.map((fileUrl, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 flex flex-col gap-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium truncate">
                      File {idx + 1}: {fileUrl.split("/").pop()}
                    </h3>
                    <a
                      href={fileUrl}
                      download
                      className="py-1 px-4 rounded border border-primary bg-primary text-white hover:bg-white hover:text-primary transition"
                    >
                      Download
                    </a>
                  </div>

                  {fileUrl.endsWith(".pdf") ? (
                    <div
                      className="border rounded-lg overflow-auto"
                      style={{ height: "400px" }}
                    >
                      <Document
                        file={fileUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      >
                        {Array.from(new Array(numPages), (_, index) => (
                          <Page
                            key={index}
                            pageNumber={index + 1}
                            width={800}
                          />
                        ))}
                      </Document>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center">
                      <img
                        src={fileUrl}
                        alt={selectedRecord.title}
                        className="max-h-[400px] rounded-lg object-contain shadow-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionManagement;
