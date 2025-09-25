import { ShoppingCartOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, message, Empty } from "antd";
import { useGetcategoryQuery } from "../../services/categoryApi";
import {
  useAddToCartMutation,
  useGetCartListQuery,
  useGetServicesQuery,
  useGetvendorQuery,
} from "../../services/vendorApi";
import { toast } from "react-toastify";
import "./cartAnimation.css"; // ⬅️ custom css file for shake animation
import NoDataAvailable from "../../pages/NoDataAvailable";
import Card from "antd/es/card/Card";
import CardCarouselLoader from "../CardCarouselLoader";

export default function ServicesList() {
  const { shopId, type, serviceId } = useParams();
  const navigate = useNavigate();
  const [addToCart, { isLoading: cartLoading }] = useAddToCartMutation();

  const { data: services, isLoading } = useGetServicesQuery({ id: serviceId });
  console.log(services);

  const { data: category } = useGetcategoryQuery();
  const categoryData = category?.data?.find((cat) => cat.name === type);
  const { data } = useGetvendorQuery(categoryData?.id);
  const shopData = data?.data?.find((cat) => cat.id === Number(shopId));

  const shopServices = shopData?.services || [];

  const [expanded, setExpanded] = useState({});
  const [loadingServiceId, setLoadingServiceId] = useState(null);

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddCart = async (service) => {
    setLoadingServiceId(service.id);
    const fd = new FormData();
    fd.append("service_id", service?.id);
    fd.append("price", service?.price);

    try {
      const res = await addToCart(fd).unwrap();

      if (res.status === "success") {
        if (res.data.added_items > 0) {
          toast.success("Service added to cart successfully!");
        } else if (res.data.already_in_cart > 0) {
          toast.info("Service is already in your cart.");
        }
      } else {
        toast.error(res.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error("Something went wrong.");
    } finally {
      setLoadingServiceId(null); // reset button state
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="mb-4 text-[#EE4E34]">
          &larr; Back
        </button>

        <h1 className="text-2xl font-bold mb-1 text-black flex justify-between items-center">
          Select Your Services
        </h1>

        {isLoading ? (
          <div className="max-w-7xl mx-auto p-6">
            <CardCarouselLoader />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1 bg-white rounded-2xl p-4">
              {services?.data?.map((service) => {
                const isExpanded = expanded[service.id];
                const shortDesc =
                  service.description?.length > 100
                    ? service.description.slice(0, 100) + "..."
                    : service.description;

                return (
                  <div
                    key={service.id}
                    style={{ maxHeight: "420px", overflowY: "auto" }}
                    className="border p-4 rounded-md flex flex-col"
                  >
                    <h2 className="font-bold text-sm text-[#EE4E34] mb-2">
                      {service.name}
                    </h2>
                    {service?.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-36 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-36 flex items-center justify-center bg-gray-100 rounded mb-2 text-gray-500 text-xs font-semibold">
                        No Image Available
                      </div>
                    )}

                    <p className="text-gray-700 mb-1 text-xs md:text-sm">
                      {isExpanded ? service.description : shortDesc}
                    </p>
                    <div className="flex justify-end">
                      {service.description?.length > 100 && (
                        <button
                          className="text-[#EE4E34] text-xs font-medium mb-2"
                          onClick={() => toggleReadMore(service.id)}
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2 text-xs md:text-sm text-gray-600">
                      <span>Gender: {service.gender || "Any"}</span>
                      <span>Duration: {service.duration} mins</span>
                      <span>Price: ₹{service.price}</span>
                    </div>

                    <Button
                      type="primary"
                      block
                      onClick={() => handleAddCart(service)}
                      className="bg-[#EE4E34] border-[#EE4E34]"
                      disabled={loadingServiceId === service.id}
                    >
                      {loadingServiceId === service.id
                        ? "Adding..."
                        : "Add to Cart"}
                    </Button>
                  </div>
                );
              })}

              {services?.data?.length === 0 && (
                // <Empty description="No services available" />
                <NoDataAvailable message="No services available" />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
