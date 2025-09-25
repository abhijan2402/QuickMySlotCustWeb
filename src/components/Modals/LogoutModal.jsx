import { Modal } from "antd";
import React from "react";

const LogoutModal = ({
  isLogoutModalOpen,
  setIsLogoutModalOpen,
  handleLogoutConfirm,
}) => {
  return (
    <div>
      <Modal
        title="Logout Confirmation"
        open={isLogoutModalOpen}
        onCancel={() => setIsLogoutModalOpen(false)}
        onOk={handleLogoutConfirm}
        okText="Yes, Logout"
        cancelText="Cancel"
        centered
        okButtonProps={{
          style: { backgroundColor: "#EE4E34", borderColor: "#EE4E34" },
        }}
      >
        <p className="text-red-600">
          Are you sure you want to logout? You’ll be logged out from your
          current session.
        </p>
      </Modal>
    </div>
  );
};

export default LogoutModal;
