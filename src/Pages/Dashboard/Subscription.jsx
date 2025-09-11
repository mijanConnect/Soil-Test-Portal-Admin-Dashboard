import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Input, List, message, Select } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import FeaturedInput from "../../components/common/PackageFeatureInput";
import GradientButton from "../../components/common/GradiantButton";
import SubscriptionHeadingIcon from "../../assets/subscription-heading.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PackagesPlans = () => {
  const defaultPackages = [
    {
      id: 1,
      title: "Basic Plan",
      description: "Billed annually.",
      price: 0,
      duration: "1 month",
      features: [
        "5 User Accounts",
        "Basic Analytics",
        "24/7 Support",
        "10GB Storage",
        "Email Integration",
      ],
      popular: false,
      active: true,
    },
    {
      id: 2,
      title: "Gold Plan",
      description: "Billed annually.",
      price: 20,
      duration: "6 months",
      features: [
        "25 User Accounts",
        "Advanced Analytics",
        "24/7 Priority Support",
        "50GB Storage",
        "Email & CRM Integration",
      ],
      popular: true,
      active: false,
    },
    {
      id: 3,
      title: "Premium Plan",
      description: "Billed annually.",
      price: 40,
      duration: "1 year",
      features: [
        "Unlimited User Accounts",
        "Enterprise Analytics",
        "Dedicated Account Manager",
        "Unlimited Storage",
        "Complete System Integration",
      ],
      popular: false,
      active: true,
    },
    {
      id: 4,
      title: "Platinum Plan",
      description: "Billed annually.",
      price: 60,
      duration: "1 year",
      features: [
        "Unlimited Users",
        "Premium Analytics",
        "Dedicated Support",
        "1TB Storage",
        "Full Integration",
      ],
      popular: false,
      active: true,
    },
    {
      id: 5,
      title: "Enterprise Plan",
      description: "Billed annually.",
      price: 100,
      duration: "1 year",
      features: [
        "All Users",
        "Custom Analytics",
        "Priority Support",
        "Unlimited Storage",
        "Custom Integrations",
      ],
      popular: true,
      active: true,
    },
  ];

  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setPackages(defaultPackages);
  }, []);

  const togglePackageStatus = (id) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, active: !pkg.active } : pkg))
    );
    message.success("Package status updated");
  };

  const showModal = (pkg = null) => {
    setIsEditing(!!pkg);
    setCurrentPackage(pkg);
    setIsModalOpen(true);

    if (pkg) {
      form.setFieldsValue({
        title: pkg.title,
        description: pkg.description,
        price: Number(pkg.price),
        duration: pkg.duration,
        features: pkg.features || [],
        popular: pkg.popular || false,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#023F86",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPackages(packages.filter((pkg) => pkg.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The package has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleSubmit = (values) => {
    const formattedData = {
      id: isEditing ? currentPackage.id : Date.now(),
      title: values.title,
      description: values.description,
      price: Number(values.price),
      duration: values.duration,
      features: values.features.filter((f) => f.trim() !== ""),
      popular: values.popular || false,
    };

    if (isEditing) {
      setPackages(
        packages.map((pkg) =>
          pkg.id === currentPackage.id ? formattedData : pkg
        )
      );
      message.success("Package updated successfully");
    } else {
      setPackages([...packages, formattedData]);
      message.success("Package added successfully");
    }

    setIsModalOpen(false);
    form.resetFields();
  };

  const getCardStyle = (pkg) => {
    if (pkg.popular) {
      return "shadow-sm rounded-xl  bg-gradient-to-b from-blue-50 to-white hover:shadow-md transition-all transform hover:-translate-y-1";
    }
    return "shadow-sm rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all transform hover:-translate-y-1";
  };

  // react-slick settings
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    dots: true, // ✅ Enable dots
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
    ),
    appendDots: (dots) => (
      <div style={{ bottom: "-30px" }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="pt-1 px-4">
      <div className="flex flex-col justify-center items-center mb-8">
        <p className="bg-primary px-[12px] py-[2px] text-white rounded-3xl mb-2">
          Pricing Plan
        </p>
        <h2 className="text-[28px] font-semibold text-secondary">
          Plans for all sizes
        </h2>
        <p className="text-[15px] font-normal mb-[10px]">
          Simple, transparent pricing that grows with you. Try any plan free for
          30 days.
        </p>
        <GradientButton
          type="primary"
          icon={<PlusOutlined />}
          className=" text-white px-5 h-auto rounded-lg shadow-lg hover:bg-[#012F60] transition-all flex items-center"
          onClick={() => showModal()}
        >
          Add Package
        </GradientButton>
      </div>
      <div className="flex justify-center">
        <div className="w-3/4 mb-6">
          {packages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No packages available.</p>
              <p>
                Click the "Add Package" button to create your first package.
              </p>
            </div>
          ) : (
            <Slider {...settings}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="px-4">
                  <Card
                    title={null}
                    bordered={false}
                    className={`${getCardStyle(
                      pkg
                    )} transition-transform duration-300`}
                  >
                    <div className="flex justify-end mb-2">
                      <div className="flex gap-2">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => showModal(pkg)}
                          className="text-gray-800 border-gray-800 hover:text-primary hover:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center mb-4">
                      <img
                        src={SubscriptionHeadingIcon}
                        alt="Subscription Icon"
                        className="w-[40px] h-[40px] mb-4"
                      />
                      <h3 className="text-[20px] font-semibold text-primary mb-[8px]">
                        {pkg.title}
                      </h3>
                      <div className="mb-2">
                        <span className="text-secondary font-semibold text-[38px]">
                          ${pkg.price}/mth
                        </span>
                      </div>
                      <p className="text-[16px] font-normal text-center text-[#667085]">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <List
                        size="small"
                        dataSource={pkg.features}
                        renderItem={(feature) => (
                          <List.Item className="text-gray-700 border-none py-1">
                            <div className="flex items-start">
                              <CheckCircleFilled className="text-green-500 mr-2 mt-1" />
                              <span>{feature}</span>
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>

                    <Button
                      className={`w-full mt-12 border ${
                        pkg.active
                          ? "border-primary hover:!bg-primary hover:!text-white"
                          : "border-gray-400 text-gray-400 hover:!bg-gray-400 hover:!text-white"
                      }`}
                      onClick={() => togglePackageStatus(pkg.id)}
                    >
                      {pkg.active ? "Turn Off" : "Turn On"}
                    </Button>
                  </Card>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      <Modal
        title={isEditing ? "Edit Package" : "Add Package"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="rounded-lg"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Package Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="e.g. Basic Plan" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Short description of what this package offers"
            />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Price is required" }]}
              className="w-1/2"
            >
              <Input type="number" prefix="$" placeholder="29.99" />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: "Duration is required" }]}
              className="w-1/2"
            >
              <Select placeholder="Select duration">
                <Select.Option value="1 month">1 Month</Select.Option>
                <Select.Option value="3 months">3 Months</Select.Option>
                <Select.Option value="6 months">6 Months</Select.Option>
                <Select.Option value="1 year">1 Year</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="features"
            label="Features"
            rules={[
              { required: true, message: "At least one feature is required" },
            ]}
          >
            <FeaturedInput />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={handleCancel}
              size="large"
              className="border border-primary hover:!border-primary hover:!text-primary"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-primary text-white rounded-lg hover:bg-[#012F60] transition-all h-auto py-2 px-6"
              size="large"
            >
              {isEditing ? "Update Package" : "Add Package"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PackagesPlans;
