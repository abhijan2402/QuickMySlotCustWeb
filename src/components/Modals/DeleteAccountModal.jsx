import { Modal } from "antd";

export function DeleteAccountModal({ open, onClose }) {
  const handleDelete = () => {
    console.log("Account deletion confirmed");
    onClose();
  };
  return (
    <Modal
      title="Delete Account"
      open={open}
      onCancel={onClose}
      onOk={handleDelete}
      okText="Yes, Delete"
      okButtonProps={{
        style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" },
      }}
      cancelText="Cancel"
      centered
    >
      <p className="text-red-600">
        Are you sure you want to permanently delete your account? This cannot be
        undone.
      </p>
    </Modal>
  );
}
