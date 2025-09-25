import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../../services/profileApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function ProfileModal({
  visible,
  onClose,
  onNext,
  userID,
  tempToken,
}) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle form submission
  const handleFinish = async (values) => {
    const fd = new FormData();

    fd.append("user_id", userID);
    fd.append("name", values.name);
    fd.append("email", values.email);
    // fd.append("phone", values.phone);
    fd.append("address", values.address);
    fd.append("city", values.city);
    fd.append("state", values.state || "");
    fd.append("country", values.country || "");
    fd.append("zip_code", values.zip_code || "");

    const profileResponse = await fetch(`${baseUrl}customer/profile/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
      body: fd,
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch profile");
    }
    const profileData = await profileResponse.json();
    toast.success("Signup successful!");
    onNext();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Complete Your Profile"
      destroyOnClose
      width="50%"
    >
      <p style={{ color: "#555", marginBottom: 16, fontSize: 13 }}>
        <strong>Note:</strong> Please provide accurate details.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        validateMessages={{
          required: "${label} is required!",
          types: {
            email: "${label} is not a valid email",
          },
        }}
      >
        {/* Name */}
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email Address"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>

        {/* Phone */}
        {/* <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true },
            {
              pattern: /^\d{10}$/,
              message: "Phone number must be exactly 10 digits",
            },
          ]}
        >
          <Input
            placeholder="1234567890"
            maxLength={10}
            inputMode="numeric"
            pattern="\d*"
            onChange={(e) => {
              const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
              form.setFieldsValue({ phone: digits });
            }}
          />
        </Form.Item> */}

        {/* Address */}
        <Form.Item
          name="address"
          label="Address"
          rules={[
            { required: true },
            { min: 5, message: "Address must be at least 5 characters" },
          ]}
        >
          <Input.TextArea rows={2} placeholder="Enter your complete address" />
        </Form.Item>

        {/* City */}
        <Form.Item
          name="city"
          label="City"
          rules={[
            { required: true },
            { min: 2, message: "City must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter your city" />
        </Form.Item>

        {/* State */}
        <Form.Item name="state" label="State">
          <Input placeholder="Enter your state" />
        </Form.Item>

        {/* Country */}
        <Form.Item name="country" label="Country">
          <Input placeholder="Enter your country" />
        </Form.Item>

        {/* Zip Code */}
        <Form.Item
          name="zip_code"
          label="Zip Code"
          rules={[
            {
              pattern: /^\d{5,6}$/,
              message: "Zip code must be 5-6 digits",
            },
          ]}
        >
          <Input
            placeholder="123456"
            maxLength={6}
            inputMode="numeric"
            pattern="\d*"
            onChange={(e) => {
              const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
              form.setFieldsValue({ zip_code: digits });
            }}
          />
        </Form.Item>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Next
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
