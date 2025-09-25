import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCartListQuery } from "../../services/vendorApi";
import { ShoppingCartOutlined } from "@ant-design/icons";

const CartButton = () => {
  const navigate = useNavigate();
  const { data: cartList } = useGetCartListQuery();
  const cartCount = cartList?.data?.total_items || 0;
  const [animateCart, setAnimateCart] = useState(false);

  // ✅ Animate cart when items change
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);
  return (
    <div
      onClick={() => navigate("/cart")}
      className={`fixed right-4 top-80 z-50 bg-white/80 border border-[#EE4E34] rounded-full
    w-14 h-14  
    flex items-center justify-center  /* center icon */
    shadow-lg backdrop-blur-md cursor-pointer transition duration-200 hover:scale-105 hover:shadow-xl ${
      animateCart ? "cart-shake" : ""
    }`}
    >
      <div className="relative">
        <ShoppingCartOutlined style={{ fontSize: 26, color: "#EE4E34" }} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#EE4E34] text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartButton;
