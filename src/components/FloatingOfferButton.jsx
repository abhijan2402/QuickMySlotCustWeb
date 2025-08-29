import { Button } from "antd";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { GiftOutlined } from "@ant-design/icons";

export default function FloatingOfferButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Show only on home page "/"
  if (location.pathname !== "/") return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      animate={{ scale: [1, 1.1, 1] }} // zoom in-out
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Button
        type="primary"
        shape="round"
        size="large"
        // icon={<GiftOutlined />}
        onClick={() => navigate("/offers")}
        style={{
          background: "linear-gradient(135deg, #ff4d4f, #ff7a45)",
          border: "none",
          color: "#fff",
          fontWeight: "bold",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
        }}
      >
        🎁 Offers Available
      </Button>
    </motion.div>
  );
}
