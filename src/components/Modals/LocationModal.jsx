import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Button, Spin } from "antd";
import {
  GoogleMap,
  MarkerF,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useLocationContext } from "../../context/LocationProvider";

const MAP_LIBRARIES = ["places"];
const mapContainerStyle = { width: "100%", height: "400px" };

const LocationModal = ({ open, initialLocation, onOk, onCancel }) => {
  const { newLoc, setNewLoc } = useLocationContext();
  console.log(newLoc);
  const [markerPos, setMarkerPos] = useState(initialLocation || null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries: MAP_LIBRARIES,
  });

  useEffect(() => {
    if (initialLocation) setMarkerPos(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    if (markerPos)
      setNewLoc({ latitude: markerPos?.lat, longitude: markerPos?.lng });
  }, [markerPos]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarkerPos({ lat, lng });
      }
    }
  };

  const handleMarkerDrag = (e) => {
    setMarkerPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const mapCenter = markerPos || initialLocation || null;

  return (
    <Modal
      title="Your Location"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" onClick={() => onOk(markerPos)}>
          Save Location
        </Button>,
      ]}
      width={600}
      centered
      destroyOnClose
    >
      {isLoaded ? (
        <>
          <Autocomplete
            onLoad={(ac) => (autocompleteRef.current = ac)}
            onPlaceChanged={onPlaceChanged}
          >
            <Input placeholder="Search location" className="mb-4" />
          </Autocomplete>

          {mapCenter ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={15}
            >
              <MarkerF
                position={markerPos || mapCenter}
                draggable
                onDragEnd={handleMarkerDrag}
              />
            </GoogleMap>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ height: 400 }}
            >
              <p>No location selected</p>
            </div>
          )}
        </>
      ) : (
        <div
          className="flex items-center justify-center"
          style={{ height: 400 }}
        >
          <Spin size="large" />
        </div>
      )}
    </Modal>
  );
};

export default LocationModal;
