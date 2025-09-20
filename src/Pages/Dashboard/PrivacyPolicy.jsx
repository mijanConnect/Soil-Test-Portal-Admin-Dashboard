import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Button, message, Modal, Spin } from "antd";
import { useGetPrivacyPolicyQuery } from "../../redux/apiSlices/privacyPolicySlice";
import { useCreateTermsAndConditionsMutation } from "../../redux/apiSlices/termsAndConditionSlice";
import toast from "react-hot-toast";

const PrivacyPolicy = () => {
  const editor = useRef(null);

  const { data, isLoading, error } = useGetPrivacyPolicyQuery();
  const [createPrivacyPolicy, { isLoading: isCreatingPrivacyPolicy }] =
    useCreateTermsAndConditionsMutation();

  const privacyPolicyData = data?.data?.[0];

  // ✅ Always define hooks on top-level
  const [termsContent, setTermsContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ When API data loads, update state using useEffect
  useEffect(() => {
    if (privacyPolicyData?.content) {
      setTermsContent(privacyPolicyData.content);
    }
  }, [privacyPolicyData]);

  if (isLoading) return <Spin size="large" />;

  const showModal = () => setIsModalOpen(true);

  const handleOk = async () => {
    try {
      const res = await createPrivacyPolicy({
        content: termsContent,
        type: "privacy",
      });
      setIsModalOpen(false);
      if (res?.data?.success) {
        toast.success(
          res?.data?.message || "Privacy Policy updated successfully!"
        );
      } else {
        toast.error(res?.data?.message || "Failed to update Privacy Policy!");
      }
    } catch (error) {
      toast.error("Failed to update Privacy Policy!");
    }
  };

  const handleCancel = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Privacy Policy</h2>
        <Button
          onClick={showModal}
          className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
        >
          Update Privacy Policy
        </Button>
      </div>

      <div className="saved-content mt-6 border p-6 rounded-lg bg-white">
        <div
          dangerouslySetInnerHTML={{ __html: termsContent }}
          className="prose max-w-none"
        />
      </div>

      <Modal
        title="Update Privacy Policy"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="65%"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="bg-red-500 text-white border-red-500 hover:text-red-500"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            className="bg-primary text-white"
          >
            Update Privacy Policy
          </Button>,
        ]}
      >
        {isModalOpen && (
          <div className="mb-6">
            <JoditEditor
              ref={editor}
              value={termsContent}
              onChange={(newContent) => setTermsContent(newContent)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrivacyPolicy;
