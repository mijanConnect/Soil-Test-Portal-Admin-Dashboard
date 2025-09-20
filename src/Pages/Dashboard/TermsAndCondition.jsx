import { Button, message, Modal, Spin } from "antd";
import JoditEditor from "jodit-react";
import { useRef, useState } from "react";
import {
  useGetTermsAndConditionsQuery,
  useCreateTermsAndConditionsMutation,
} from "../../redux/apiSlices/termsAndConditionSlice";
import toast from "react-hot-toast";

const TermsAndCondition = () => {
  const editor = useRef(null);

  // API calls
  const { data, isLoading } = useGetTermsAndConditionsQuery();
  const [createTermsAndConditions] = useCreateTermsAndConditionsMutation();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsContent, setTermsContent] = useState("");

  // Set initial content when data is fetched
  if (!termsContent && data?.data?.length) {
    setTermsContent(data.data.map((item) => item.content).join("<br />"));
  }

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleOk = async () => {
    try {
      const res = await createTermsAndConditions({
        content: termsContent,
        type: "terms",
      }).unwrap();
      if (res?.success) {
        toast.success("Terms & Conditions updated successfully!");
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error("Failed to update Terms & Conditions!");
      console.log(err);
    }
  };

  if (isLoading)
    return <Spin size="large" className="flex justify-center mt-10" />;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Terms & Conditions</h2>
        <Button
          onClick={showModal}
          className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
        >
          Update Terms & Conditions
        </Button>
      </div>

      {/* Display saved content */}
      <div className="saved-content mt-6 border p-6 rounded-lg bg-white">
        <div
          dangerouslySetInnerHTML={{ __html: termsContent }}
          className="prose max-w-none"
        />
      </div>

      {/* Modal */}
      <Modal
        title="Update Terms & Conditions"
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
            Update Terms & Conditions
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

export default TermsAndCondition;
