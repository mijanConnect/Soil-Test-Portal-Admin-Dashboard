import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tooltip,
  Switch,
  Spin,
  Pagination,
} from "antd";
import { FaTrash } from "react-icons/fa";
import { EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} from "../../redux/apiSlices/categorySlice";

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
  const [page, setPage] = useState(1); // Page state
  const [limit, setLimit] = useState(10); // Limit state
  const [searchText, setSearchText] = useState(""); // Search state
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewForm] = Form.useForm();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // Fetch categories with pagination and search
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetAllCategoryQuery({
    page,
    limit,
    search: searchText,
  });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Handle loading state
  if (isLoading) {
    return <Spin size="large" />;
  }

  // Handle error state
  if (error) {
    return <div className="p-4 text-red-500">Failed to load categories.</div>;
  }

  const categoryData = categories?.data;

  // Show view modal for editing category
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
    viewForm
      .validateFields()
      .then((values) => {
        updateCategory({
          id: selectedRecord._id,
          updatedData: values,
        })
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Updated!",
              text: "Category details have been updated successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            setIsViewModalVisible(false);
            refetch();
          })
          .catch((err) => {
            Swal.fire({
              title: "Error!",
              text: err.message || "Failed to update category.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false,
            });
          });
      })
      .catch((err) => console.log(err));
  };

  const handleAddCategory = () => {
    addForm
      .validateFields()
      .then((values) => {
        createCategory(values)
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Category Added!",
              text: `Category ${values.title} has been added successfully.`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            addForm.resetFields();
            setIsAddModalVisible(false);
            refetch();
          })
          .catch((err) => {
            Swal.fire({
              title: "Error!",
              text: err.message || "Failed to add category.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false,
            });
          });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCategory = (id) => {
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
        deleteCategory(id)
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your category has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            refetch();
          })
          .catch((err) => {
            Swal.fire({
              title: "Error!",
              text: err.message || "Failed to delete category.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false,
            });
          });
      }
    });
  };

  const columns = [
    {
      title: "SL",
      key: "sl",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category Name",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "categoryStatus",
      key: "categoryStatus",
      align: "center",
      render: (text) => (text ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-3">
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
              onClick={() => handleDeleteCategory(record._id)}
              className="text-red-500 hover:text-red-700 text-md"
            >
              <FaTrash />
            </button>
          </Tooltip>

          <Switch
            size="small"
            checked={record.categoryStatus === true}
            style={{
              backgroundColor:
                record.categoryStatus === true ? "#48B14C" : "gray",
            }}
            onChange={(checked) => {
              const updatedStatus = checked ? "Active" : "Inactive";
              updateCategory({
                id: record._id,
                updatedData: { categoryStatus: checked },
              })
                .unwrap()
                .then(() => {
                  Swal.fire({
                    title: "Updated!",
                    text: `Status has been changed to ${updatedStatus}.`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                  refetch();
                })
                .catch((err) => {
                  Swal.fire({
                    title: "Error!",
                    text: err.message || "Failed to update status.",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                });
            }}
          />
        </div>
      ),
    },
  ];

  // Pagination logic
  const onPageChange = (page, pageSize) => {
    setPage(page);
    setLimit(pageSize);
  };

  return (
    <div>
      {/* Search and Add Category */}
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
        <Button
          type="primary"
          onClick={() => setIsAddModalVisible(true)}
          className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
        >
          Add New Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={categoryData}
          columns={columns}
          pagination={false} // Disable Ant Design pagination, use custom pagination below
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* Custom Pagination */}
      <div style={{ textAlign: "right", marginTop: "16px" }}>
        <Pagination
          current={page}
          pageSize={limit}
          total={categories?.pagination?.total}
          onChange={onPageChange}
          defaultCurrent={1}
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
                name="title"
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
              name="title"
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
