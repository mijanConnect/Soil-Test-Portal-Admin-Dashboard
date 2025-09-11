import React, { useState } from "react";
import { Button, Modal, Input, Form, Switch, Tooltip } from "antd";
import Swal from "sweetalert2";

export default function TierSystem() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [tiers, setTiers] = useState([
    {
      name: "Basic",
      threshold: 0,
      reward: "10% Off",
      lockoutDuration: 0,
      pointsSystemLockoutDuration: 0,
      active: true,
    },
    {
      name: "Gold",
      threshold: 10000,
      reward: "15% Off",
      lockoutDuration: 0,
      pointsSystemLockoutDuration: 0,
      active: true,
    },
    {
      name: "Premium",
      threshold: 20000,
      reward: "20% Off",
      lockoutDuration: 0,
      pointsSystemLockoutDuration: 0,
      active: true,
    },
  ]);

  // Open modal with tier details for edit
  const showModal = (tier = null) => {
    setEditingTier(tier);
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTier(null);
  };

  // Save changes for both new and existing tiers
  const handleSave = (values) => {
    if (editingTier) {
      setTiers((prev) =>
        prev.map((t) =>
          t.name === editingTier.name ? { ...t, ...values } : t
        )
      );
    } else {
      setTiers((prev) => [...prev, { ...values, active: true }]);
    }
    setIsModalVisible(false);
    setEditingTier(null);
  };

  // Delete a tier with confirmation
  const handleDelete = (tierName) => {
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
        setTiers((prev) => prev.filter((t) => t.name !== tierName));
        Swal.fire({
          title: "Deleted!",
          text: "The tier has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Toggle tier active status
  const toggleActive = (tierName) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.name === tierName ? { ...t, active: !t.active } : t
      )
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-8">
        <div>
          <h1 className="text-[24px] font-bold">Point & Tier System</h1>
          <p className="text-[16px] font-normal mt-2">
            Configure your tiers, rewards, and point accumulation rules.
          </p>
        </div>
        <Button
          type="primary"
          onClick={() => showModal()}
          className="bg-primary text-white hover:text-secondary font-bold"
        >
          Add New Tier
        </Button>
      </div>

      {/* Tier Cards */}
      <div className="px-8 py-8 flex flex-col gap-4 border border-gray-200 rounded-lg">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="px-6 py-4 rounded-lg border border-primary bg-white flex justify-between items-center"
          >
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-[24px] text-secondary">
                {tier.name} {tier.active ? "" : "(Inactive)"}
              </h2>
              <p>Points Threshold: {tier.threshold}</p>
              <p>Reward: {tier.reward}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={tier.active}
                onChange={() => toggleActive(tier.name)}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
              <Button
                className="bg-primary text-white hover:text-secondary font-bold"
                onClick={() => showModal(tier)}
              >
                Edit
              </Button>
              <Button
                danger
                onClick={() => handleDelete(tier.name)}
                className="font-bold"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Change Log */}
      <div className="px-8 py-8">
        <div className="px-6 py-4 rounded-lg border border-primary bg-white flex flex-col gap-2 mt-2">
          <h2 className="font-bold text-[24px] text-secondary">
            Tier System Change Log
          </h2>
          <p>Added Gold Tier with 10000 points threshold.</p>
          <p>admin@merchant.com - 2024-06-15 10:30 AM</p>
          <p>Updated Silver Tier point multiplier to 1.5x.</p>
          <p>admin@merchant.com - 2024-06-10 02:00 PM</p>
        </div>
      </div>

      {/* Ant Design Modal */}
      <Modal
        title={editingTier ? `Edit Tier - ${editingTier.name}` : "Add New Tier"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingTier || { lockoutDuration: 0, pointsSystemLockoutDuration: 0 }}
          onFinish={handleSave}
        >
          <Form.Item
            label="Tier Name"
            name="name"
            rules={[{ required: true, message: "Please enter tier name" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Points Threshold"
            name="threshold"
            rules={[{ required: true, message: "Please enter threshold" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Reward"
            name="reward"
            rules={[{ required: true, message: "Please enter reward" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tier Lockout Duration (Month)"
            name="lockoutDuration"
            rules={[{ required: true, message: "Please enter lockout duration" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Points System Lockout Duration (Month)"
            name="pointsSystemLockoutDuration"
            rules={[{ required: true, message: "Please enter points system lockout duration" }]}
          >
            <Input type="number" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel} className="border border-primary">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-primary text-white hover:text-secondary font-bold"
            >
              {editingTier ? "Save Changes" : "Add Tier"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
