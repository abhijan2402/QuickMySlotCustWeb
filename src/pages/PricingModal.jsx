import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Form } from "antd";
import {
  useAddSubscriptionMutation,
  useGetsubscriptionQuery,
  useVerifySubscriptionMutation,
} from "../services/subscriptionApi";

const MembershipPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // ✅ Membership Plans
  const plans = [
    {
      id: 1,
      type: "monthly",
      subscription_name: "Pro Membership",
      price: 299,
      badge: "Starter Pack",
      tagline: "Perfect for getting started",
      extra: {
        feature1: "Boost your profile visibility",
        feature2: "Access exclusive promotions",
        feature3: "Priority customer support",
      },
    },
    {
      id: 2,
      type: "yearly",
      subscription_name: "Elite Membership",
      price: 2499,
      badge: "Most Popular",
      tagline: "Best value for long-term growth",
      extra: {
        feature1: "Boost your profile visibility",
        feature2: "Access exclusive promotions",
        feature3: "Priority customer support",
        feature4: "Save more with yearly billing",
      },
    },
  ];

  const { data } = useGetsubscriptionQuery();

  console.log(data?.data);

  const [addSubscription] = useAddSubscriptionMutation();
  const [verifySubscription] = useVerifySubscriptionMutation();

  const handlePayment = async () => {
    if (!selectedPlan) return;

    console.log("Payment started for plan:", selectedPlan);
    const formData = new FormData();
    formData.append("subscription_id", selectedPlan.id);
    formData.append("role", "customer");

    try {
      const order = await addSubscription(formData).unwrap();
      if (!order?.order_id) {
        toast.error("Failed to create Razorpay order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order?.amount,
        currency: "INR",
        name: "QuickMySlot",
        description: "Membership Payment",
        image: "/logo1.png",
        order_id: order?.order_id,
        handler: async function (response) {
          const verifyData = new FormData();
          verifyData.append(
            "subscription_user_id",
            order?.subscription_user_id
          );
          verifyData.append(
            "razorpay_payment_id",
            response.razorpay_payment_id
          );
          verifyData.append("razorpay_order_id", response.razorpay_order_id);
          verifyData.append("razorpay_signature", response.razorpay_signature);

          try {
            const verifyRes = await verifySubscription(verifyData).unwrap();
            if (verifyRes.status) {
              toast.success("Payment verified & subscription activated!");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Error verifying payment");
            console.error(err);
          }
        },
        prefill: {
          name: user?.name,
          contact: user?.phone_number,
          email: user?.email,
        },
        theme: { color: "#EE4E34" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
        Upgrade Your Experience
      </h2>
      <p className="text-gray-600 mb-12 text-base md:text-lg max-w-2xl mx-auto">
        Choose the plan that suits you best. Unlock exclusive features, enjoy
        premium support, and maximize your visibility.
      </p>

      {/* Membership Cards */}
      <div className="grid gap-8 md:grid-cols-2">
        {data?.data?.map((plan) => (
          <div
            key={plan.id}
            className="relative flex flex-col shadow-xl rounded-2xl p-8 border hover:shadow-2xl transition-all bg-white"
          >
            {/* Badge */}
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#EE4E34] text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">
                {plan.subscription_name === "Professional Plan customer"
                  ? "Starter Pack"
                  : "Most Popular"}
              </span>

            {/* Title */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-1">
              {plan.subscription_name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{plan.tagline}</p>

            {/* Price */}
            <p className="text-4xl font-bold text-gray-800 mb-4">
              ₹{plan.price}
              <span className="text-base font-normal text-gray-500 ml-1">
                /{plan.type === "monthly" ? "mo" : "yr"}
              </span>
            </p>

            {/* Features */}
            <ul className="list-disc ml-5 text-left text-gray-700 mb-6 space-y-2">
              {Object.keys(plan.extra).map((key) => (
                <li key={key}>{plan.extra[key]}</li>
              ))}
            </ul>

            {/* Button */}
            <button
              onClick={() => {
                setSelectedPlan(plan);
                setModalVisible(true);
              }}
              className="mt-auto bg-[#EE4E34] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d63c25] transition"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {modalVisible && selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-orange-600">
              Confirm Subscription
            </h2>
            <p className="text-gray-700">
              You have selected{" "}
              <strong>{selectedPlan.subscription_name}</strong> for{" "}
              <strong>₹{selectedPlan.price}</strong> (
              {selectedPlan.type === "monthly" ? "Monthly" : "Yearly"} plan).
            </p>

            <ul className="list-disc ml-6 mt-4 text-gray-700">
              {Object.keys(selectedPlan?.extra || {}).map((key) => (
                <li key={key}>{selectedPlan.extra[key]}</li>
              ))}
            </ul>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#EE4E34] text-white hover:bg-[#d63c25]"
                onClick={handlePayment}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;
