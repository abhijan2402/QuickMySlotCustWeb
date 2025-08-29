import { Button, Form, Input, Modal } from "antd";

export function ChangePasswordModal({ open, onClose }) {
  const [form] = Form.useForm();
  const handleSubmit = (values) => {
    console.log("Change Password Values", values);
    onClose();
    form.resetFields();
  };
  return (
    <Modal
      title="Change Password"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: "Please enter current password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, message: "Please enter new password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value)
                  return Promise.resolve();
                return Promise.reject("Passwords do not match!");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-[#6961AB]">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
