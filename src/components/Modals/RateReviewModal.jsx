import React, { useState } from "react";
import { Modal, Button, Rate, Input, Form } from "antd";

const { TextArea } = Input;

export default function RateReviewModal({ open, onClose }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [form] = Form.useForm();

  const handleOk = () => {
    const data = { rating, review };
    console.log("Submitted data:", data);
    onClose();
    form.resetFields();
    setRating(0);
    setReview("");
  };

  return (
    <Modal
      title="Rate & Review"
      open={open}
      onCancel={onClose}
      centered
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          style={{ borderColor: "#6961AB", color: "#6961AB" }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          style={{
            backgroundColor: "#6961AB",
            borderColor: "#6961AB",
            color: "#fff",
          }}
        >
          Submit
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Rating" required>
          <Rate value={rating} onChange={setRating} />
        </Form.Item>
        <Form.Item
          label="Review"
          required
          rules={[{ required: true, message: "Please write your review." }]}
        >
          <TextArea
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
