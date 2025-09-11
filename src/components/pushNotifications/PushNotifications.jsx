import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import GradientButton from "../../components/common/GradiantButton";
import { Button, Input, message, Select } from "antd";

const { Option } = Select;

const PushNotifications = () => {
  const editor = useRef(null);

  // States
  const [segment, setSegment] = useState("");
  const [title, setTitle] = useState("");
  const [bodyContent, setBodyContent] = useState("");

  const handleSend = () => {
    if (!segment.trim()) {
      message.error("Please select a segment.");
      return;
    }
    if (!title.trim() || !bodyContent.trim()) {
      message.error("Please fill in both title and body before sending.");
      return;
    }
    message.success("Push Notification sent successfully!");
    console.log("Notification Data:", { segment, title, bodyContent });

    // Reset fields after sending
    setSegment("");
    setTitle("");
    setBodyContent("");
  };

  const handleCancel = () => {
    setSegment("");
    setTitle("");
    setBodyContent("");
    message.info("Notification draft cleared.");
  };

  return (
    <div className="border rounded-lg px-12 py-8 bg-white">
      <div className="flex justify-between items-center mb-[50px]">
        <h2 className="text-xl font-bold">Send Push Notifications</h2>
      </div>

      {/* Segment Dropdown */}
      <div className="mb-6 flex flex-col gap-2">
        <label className="font-bold text-[18px] mb-1">Segment</label>
        <Select
          placeholder="Select Segment"
          value={segment}
          onChange={(value) => setSegment(value)}
          style={{ width: "100%" }}
        >
          <Option value="all_users">All Users</Option>
          <Option value="premium_members">Premium Members</Option>
          <Option value="gold_members">Gold Members</Option>
          <Option value="inactive_users">Inactive Users</Option>
        </Select>
      </div>

      {/* Title Field */}
      <div className="mb-6 flex flex-col gap-2">
        <label className="font-bold text-[18px] mb-1">Title</label>
        <Input
          placeholder="Enter notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Body Editor */}
      <div className="mb-6 flex flex-col gap-2">
        <label className="font-bold text-[18px] mb-1">Body</label>
        <JoditEditor
          ref={editor}
          value={bodyContent}
          onChange={(newContent) => setBodyContent(newContent)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button onClick={handleCancel} className="px-12 py-5">
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          className="bg-primary text-white px-12 py-5"
        >
          Send
        </Button>
      </div>

      {/* Preview */}
      {(segment || title || bodyContent) && (
        <div className="saved-content mt-6 border p-6 rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          {segment && (
            <p className="text-md font-medium mb-2">
              <strong>Segment:</strong>{" "}
              {segment
                .replace("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
          )}
          {title && <h4 className="text-md font-bold mb-2">{title}</h4>}
          {bodyContent && (
            <div
              dangerouslySetInnerHTML={{ __html: bodyContent }}
              className="prose max-w-none"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PushNotifications;
