import React, { useState } from "react";
import {
  FaWallet,
  FaSignOutAlt,
  FaChartPie,
  FaUserCircle,
  FaHeart,
  FaGift,
} from "react-icons/fa";
import { Modal, Input, Button, Upload, Form, Tabs, List, Collapse } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { InviteModal } from "../components/Modals/InviteModal";
import { ChangePasswordModal } from "../components/Modals/ChangePasswordModal";
import { DeleteAccountModal } from "../components/Modals/DeleteAccountModal";
import { useGetProfileQuery } from "../services/profileApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";

const { Panel } = Collapse;

const { TabPane } = Tabs;

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { data: profile } = useGetProfileQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // const [profile, setProfile] = useState({
  //   name: "John Doe",
  //   email: "johndoe@gmail.com",
  //   phone: "+91 9876543210",
  //   wallet: 1200,
  //   image: null,
  // });

  const handleLogoOut = () => {
    dispatch(logout());
  };

  // Sample wallet history data
  const walletHistory = [
    {
      id: 1,
      type: "Credit",
      amount: 500,
      date: "2025-08-10",
      desc: "Monthly cashback",
    },
    {
      id: 2,
      type: "Debit",
      amount: 300,
      date: "2025-08-15",
      desc: "Payment for appointment",
    },
    {
      id: 3,
      type: "Credit",
      amount: 200,
      date: "2025-08-18",
      desc: "Referral bonus",
    },
  ];

  // FaQs
  const faqsData = [
    {
      category: "Profile",
      faqs: [
        {
          question: "How do I edit my profile?",
          answer:
            "To edit your profile, click the 'Edit Profile' button on your profile page. Update your information and save the changes.",
        },
        {
          question: "How do I change my password?",
          answer:
            "Use the 'Change Password' menu option. Enter your current password, then set and confirm the new password.",
        },
      ],
    },
    {
      category: "Account",
      faqs: [
        {
          question: "How do I delete my account?",
          answer:
            "Go to the 'Delete Account' section under settings. Confirm your choice to permanently delete your account.",
        },
        {
          question: "How do I recover a deleted account?",
          answer:
            "Unfortunately, deleted accounts cannot be recovered. Please contact support for further assistance.",
        },
      ],
    },
    // Add more categories and FAQs as needed
  ];

  // For image preview
  const [previewImage, setPreviewImage] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    setIsModalOpen(false);
  };

  // Handle upload manually to preview image (no actual upload)
  const handleUploadChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profile?.data?.image ? (
              <img
                src={profile?.data?.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-5xl text-gray-600" />
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {profile?.data?.name}
              </h2>
              <p className="text-gray-500">{profile?.data?.email}</p>
              <p className="text-sm text-gray-400">
                {profile?.data?.phone_number}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FaWallet className="text-green-500 text-xl" />
              <span className="font-semibold text-gray-800">₹{1000}</span>
              <Button
                style={{ backgroundColor: "#FFE4E1" }}
                onClick={handleLogoOut}
                danger
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* USer Utility Buttons */}
        <div className="space-y-2 flex flex-col md:flex-row md:space-x-2 md:space-y-0">
          <Button
            onClick={showModal}
            style={{ backgroundColor: "#6CB4EE", color: "#fff" }}
          >
            Edit Profile
          </Button>
          <Button
            onClick={() => setInviteOpen(true)}
            style={{ backgroundColor: "#50C878", color: "#fff" }}
          >
            Invite Family & Friends
          </Button>
          <Button
            onClick={() => setChangePassOpen(true)}
            style={{ backgroundColor: "#6961AB", color: "#fff" }}
          >
            Change Password
          </Button>
          <Button onClick={() => setDeleteOpen(true)} danger>
            Delete Account
          </Button>
        </div>

        {/* Tabs for Analytics and Wallet History */}
        <Tabs
          defaultActiveKey="analytics"
          type="line"
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <Tabs.TabPane tab="My Analytics" key="analytics">
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
          </Tabs.TabPane>

          <Tabs.TabPane tab="Wallet History" key="wallet">
            <List
              itemLayout="horizontal"
              dataSource={walletHistory}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.type} - ₹${item.amount}`}
                    description={`${item.desc} on ${new Date(
                      item.date
                    ).toLocaleDateString()}`}
                  />
                </List.Item>
              )}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="FAQ" key="faq">
            {faqsData.map(({ category, faqs }) => (
              <div key={category} className="mb-6">
                <h2 className="text-sm font-bold mb-4">{category}</h2>
                <Collapse accordion>
                  {faqs.map(({ question, answer }, i) => (
                    <Panel header={question} key={i}>
                      <p>{answer}</p>
                    </Panel>
                  ))}
                </Collapse>
              </div>
            ))}
          </Tabs.TabPane>
        </Tabs>

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
              name: profile?.data?.name,
              email: profile?.data?.email,
              phone: profile?.data?.phone,
            }}
            onFinish={onFinish}
          >
            <Form.Item label="Profile Image">
              <Upload
                beforeUpload={() => false}
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
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <ChangePasswordModal
        open={changePassOpen}
        onClose={() => setChangePassOpen(false)}
      />
      <DeleteAccountModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
