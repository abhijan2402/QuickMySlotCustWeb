import React, { useState } from "react";
import {
  FaWallet,
  FaSignOutAlt,
  FaChartPie,
  FaUserCircle,
  FaHeart,
  FaGift,
} from "react-icons/fa";
import { Modal, Input, Button, Upload, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+91 9876543210",
    wallet: 1200,
    image: null,
  });

  // For image preview
  const [previewImage, setPreviewImage] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    setProfile((prev) => ({
      ...prev,
      name: values.name,
      email: values.email,
      phone: values.phone,
      image: previewImage || prev.image,
    }));
    setIsModalOpen(false);
  };

  // Handle upload manually to preview image (no actual upload)
  const handleUploadChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      // Read file as base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-5xl text-gray-600" />
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-sm text-gray-400">{profile.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FaWallet className="text-green-500 text-xl" />
            <span className="font-semibold text-gray-800">
              ₹{profile.wallet}
            </span>
          </div>
          <button
            onClick={showModal}
            className="bg-[#6961AB] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* My Analytics Dashboard */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-6">My Analytics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl shadow bg-gradient-to-r from-blue-50 to-blue-100">
            <h4 className="text-gray-700 font-semibold flex items-center gap-2">
              <FaWallet className="text-blue-500" /> Spend This Month
            </h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">₹2,300</p>
          </div>
          <div className="p-4 rounded-xl shadow bg-gradient-to-r from-green-50 to-green-100">
            <h4 className="text-gray-700 font-semibold flex items-center gap-2">
              <FaGift className="text-green-500" /> Saved This Month
            </h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">₹450</p>
          </div>
          <div className="p-4 rounded-xl shadow bg-gradient-to-r from-purple-50 to-purple-100">
            <h4 className="text-gray-700 font-semibold flex items-center gap-2">
              <FaChartPie className="text-purple-500" /> Total Bookings
            </h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">18</p>
          </div>
          <div className="p-4 rounded-xl shadow bg-gradient-to-r from-pink-50 to-pink-100">
            <h4 className="text-gray-700 font-semibold flex items-center gap-2">
              <FaHeart className="text-pink-500" /> Favorite Providers
            </h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">4</p>
          </div>
          <div className="p-4 rounded-xl shadow bg-gradient-to-r from-yellow-50 to-yellow-100">
            <h4 className="text-gray-700 font-semibold flex items-center gap-2">
              <FaGift className="text-yellow-500" /> Cashback Earned
            </h4>
            <p className="text-2xl font-bold text-gray-900 mt-2">₹300</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={{
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
          }}
          onFinish={onFinish}
        >
          <Form.Item label="Profile Image">
            <Upload
              beforeUpload={() => false} // Prevent upload default action
              onChange={handleUploadChange}
              showUploadList={false}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-3 rounded-full w-24 h-24 object-cover"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input your name!" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item className="text-right">
            <Button onClick={handleCancel} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-[#6961AB]">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
