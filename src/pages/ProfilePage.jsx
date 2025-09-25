import React, { useState } from "react";
import {
  FaWallet,
  FaSignOutAlt,
  FaUserEdit,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import {
  Modal,
  Input,
  Button,
  Upload,
  Form,
  Space,
  Tooltip,
  Card,
  Divider,
} from "antd";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

import { useUpdateProfileMutation } from "../services/profileApi";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../slices/authSlice";
import DashboardTabs from "../components/DashboardTabs";
import { toast } from "react-toastify";
import LogoutModal from "../components/Modals/LogoutModal";

const { confirm } = Modal;

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();

  // file list for image cropper
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(user?.image || null);

  const inviteLink = "https://yourapp.com/invite?code=XYZ123";

  const copyLink = () => navigator.clipboard.writeText(inviteLink);

  // open logout confirmation modal
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  // confirmed logout
  const handleLogoutConfirm = () => {
    dispatch(logout());
    setIsLogoutModalOpen(false);
  };

  // handle crop & preview updates
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(user?.image || null);
    }
  };

  const handelUpdateProfile = async (values) => {
    try {
      const formData = new FormData();

      // ✅ append cropped image (if selected)
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_picture", fileList[0].originFileObj);
      }

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address || "");
      formData.append("city", values.city || "");
      formData.append("zip_code", values.zip_code || "");

      const res = await updateProfile(formData).unwrap();
      dispatch(setUser(res.data));

      // reset after update
      setIsModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Card */}
      <Card className="rounded-2xl shadow-md" bodyStyle={{ padding: "24px" }}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Profile Info */}
          <div className="flex-1 flex items-center gap-6">
            <div className="relative w-20 h-20">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#EE4E34] text-white flex items-center justify-center text-3xl font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "D"}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.name || "NA"}
              </h2>
              <p className="text-gray-600">Email: {user?.email || "NA"}</p>
              <p className="text-gray-500">
                Ph. No: {user?.phone_number || "NA"}
              </p>
              {/* <p className="text-gray-400">{user?.address || "NA"}</p> */}
              {/* <p className="text-gray-400">{user?.city || "NA"}</p>
              <p className="text-gray-400">{user?.zip_code || "NA"}</p> */}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex gap-3 flex-wrap justify-end">
            <Tooltip title="Wallet Balance">
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full shadow-sm">
                <FaWallet className="text-green-600 text-lg" />
                <span className="font-semibold text-gray-800">₹1000</span>
              </div>
            </Tooltip>

            <Tooltip title="Edit Profile">
              <Button
                shape="circle"
                icon={<FaUserEdit />}
                style={{ backgroundColor: "#6CB4EE", color: "#fff" }}
                onClick={() => setIsModalOpen(true)}
              />
            </Tooltip>

            <Tooltip title="Logout">
              <Button
                shape="circle"
                icon={<FaSignOutAlt />}
                danger
                onClick={handleLogoutClick}
              />
            </Tooltip>
          </div>
        </div>

        <Divider />

        {/* Invite Section */}
        <div>
          <h3 className="text-lg font-semibold text-[#EE4E34] mb-2">
            Invite Family & Friends
          </h3>
          <p className="text-gray-600 mb-3">
            Share this invite link with your friends to join!
          </p>

          <Input.Group compact className="mb-4">
            <Input style={{ width: "75%" }} value={inviteLink} readOnly />
            <Button
              style={{ backgroundColor: "#EE4E34", color: "#fff" }}
              onClick={copyLink}
            >
              Copy
            </Button>
          </Input.Group>

          <Space size="large" className="mb-4">
            <Button
              shape="circle"
              icon={<FaInstagram />}
              style={{ backgroundColor: "#C13584", color: "#fff" }}
              onClick={() =>
                window.open("https://instagram.com/yourprofile", "_blank")
              }
            />
            <Button
              shape="circle"
              icon={<FaFacebookF />}
              style={{ backgroundColor: "#1877F2", color: "#fff" }}
              onClick={() =>
                window.open("https://facebook.com/yourprofile", "_blank")
              }
            />
            <Button
              shape="circle"
              icon={<FaTwitter />}
              style={{ backgroundColor: "#1DA1F2", color: "#fff" }}
              onClick={() =>
                window.open("https://twitter.com/yourprofile", "_blank")
              }
            />
            <Button
              shape="circle"
              icon={<FaYoutube />}
              style={{ backgroundColor: "#FF0800", color: "#fff" }}
              onClick={() => window.open("https://youtube.com/", "_blank")}
            />
            <Button
              shape="circle"
              icon={<FaLinkedin />}
              style={{ backgroundColor: "#007FFF", color: "#fff" }}
              onClick={() => window.open("https://linkedin.com/", "_blank")}
            />
          </Space>
        </div>
      </Card>

      {/* Tabs Section */}
      <DashboardTabs />

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={{
            name: user?.name,
            email: user?.email,
            phone: user?.phone_number,
            address: user?.address,
            city: user?.city,
            zip_code: user?.zip_code,
          }}
          onFinish={handelUpdateProfile}
        >
          <Form.Item
            label="Profile Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleUploadChange}
                accept="image/*"
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload & Crop</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item label="Phone Number" name="phone">
            <Input placeholder="Enter your phone number" readOnly />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input placeholder="Enter your address" />
          </Form.Item>

          <Form.Item label="City" name="city">
            <Input placeholder="Enter your city" />
          </Form.Item>

          <Form.Item label="Zip Code" name="zip_code">
            <Input placeholder="Enter your zip code" />
          </Form.Item>

          <Form.Item className="text-right">
            <Button onClick={() => setIsModalOpen(false)} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-[#EE4E34]">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Logout Moda */}
      <LogoutModal
        isLogoutModalOpen={isLogoutModalOpen}
        handleLogoutConfirm={handleLogoutConfirm}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
      />
    </div>
  );
}
