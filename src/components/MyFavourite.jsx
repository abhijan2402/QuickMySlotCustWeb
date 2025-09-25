import React from "react";
import {
  useGetWishListQuery,
  useRemoveWishListMutation,
} from "../services/vendorApi";
import { BsFillHeartFill } from "react-icons/bs";
import { toast } from "react-toastify";

const MyFavourite = () => {
  const { data, isLoading } = useGetWishListQuery();
  const [removeWishList] = useRemoveWishListMutation();

  const handleRemoveWishList = async (id) => {
    try {
      await removeWishList(id).unwrap();
      toast.success("Removed from Favourite");
    } catch {
      toast.error("Failed to Remove Favourite.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!data?.data?.wishlist?.length) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        No data found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {data.data.wishlist.map((shop) => (
        <div
          key={shop.wishlist_id}
          className="border rounded-lg p-4 shadow hover:shadow-lg transition relative"
        >
          {/* Remove Wishlist Button */}
          <button
            className="absolute top-2 right-2 flex items-center rounded-full p-2 text-xl text-red-500 border border-orange-700"
            onClick={() => handleRemoveWishList(shop.wishlist_id)}
          >
            <BsFillHeartFill className="text-red-500" />
          </button>

          {/* Vendor Info */}
          <h3 className="text-lg font-semibold">{shop.vendor.business_name}</h3>
          <p className="text-sm text-gray-500">
            {shop.vendor.business_description}
          </p>
          <p className="text-sm mt-2">
            <strong>Location:</strong> {shop.vendor.exact_location}
          </p>
          <p className="text-sm">
            <strong>Email:</strong> {shop.vendor.email}
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> {shop.vendor.phone_number}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyFavourite;
