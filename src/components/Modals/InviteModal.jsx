import { Button, Input, Modal, Space } from "antd";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

export function InviteModal({ open, onClose }) {
  const inviteLink = "https://yourapp.com/invite?code=XYZ123";

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <Modal
      title="Invite Family & Friends"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <p className="text-black mb-1 font-semibold">
        Share this invite link with your friends to join!
      </p>
      <Input.Group compact className="mb-4">
        <Input style={{ width: "80%" }} value={inviteLink} readOnly />
        <Button
          style={{ backgroundColor: "#6961AB", color: "#fff" }}
          onClick={copyLink}
        >
          Copy
        </Button>
      </Input.Group>

      <p className="text-black mb-2 font-medium">Follow us on:</p>
      <Space size="large" className="mb-4">
        <Button
          shape="circle"
          icon={<FaInstagram />}
          onClick={() =>
            window.open("https://instagram.com/yourprofile", "_blank")
          }
          style={{ backgroundColor: "#C13584", color: "#fff", border: "none" }}
        />
        <Button
          shape="circle"
          icon={<FaFacebookF />}
          onClick={() =>
            window.open("https://facebook.com/yourprofile", "_blank")
          }
          style={{ backgroundColor: "#1877F2", color: "#fff", border: "none" }}
        />
        <Button
          shape="circle"
          icon={<FaTwitter />}
          onClick={() =>
            window.open("https://twitter.com/yourprofile", "_blank")
          }
          style={{ backgroundColor: "#1DA1F2", color: "#fff", border: "none" }}
        />
      </Space>

      <Button
        block
        type="primary"
        style={{ backgroundColor: "#6961AB", borderColor: "#6961AB" }}
        onClick={copyLink}
      >
        Share Invite Link
      </Button>
    </Modal>
  );
}
