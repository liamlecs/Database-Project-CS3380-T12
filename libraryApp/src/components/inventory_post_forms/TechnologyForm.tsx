import React, { useState, useEffect } from "react";
import "./TechnologyForm.css"; // optional styling

const TechnologyForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    deviceTypeId: "",
    manufacturerId: "",
    modelNumber: "",
    coverImagePath: "",
    totalCopies: "",
    availableCopies: "", 
    location: "",
    itemTypeID: 4 // if 4 represents technology
  });

  // States to hold fetched dropdown data:
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);

  // "Other" logic if you allow dynamic creation:
  const [newDeviceType, setNewDeviceType] = useState("");
  const [newManufacturerName, setNewManufacturerName] = useState("");

  // 1. Fetch dropdown data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeRes, mfrRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/DeviceType`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/TechnologyManufacturer`)
        ]);
        if (!typeRes.ok || !mfrRes.ok) {
          throw new Error("Failed to fetch device types / manufacturers");
        }
        const typeData = await typeRes.json();
        // console.log("Device types:", typeData); // Check the output
        const mfrData = await mfrRes.json();
        // console.log("Manufacturers:", mfrData); // Check the output

        setDeviceTypes(typeData);
        setManufacturers(mfrData);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchData();
  }, []);

  // 2. Common input change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`DEBUG: name=${name}, value=${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. File upload for the cover image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadData = new FormData();
      uploadData.append("Cover", file);
      try {
        // Reuse existing Book/upload-cover or create a new one for Technology
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Book/upload-cover`, {
          method: "POST",
          body: uploadData
        });
        if (!res.ok) {
          throw new Error("Image upload failed");
        }
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          coverImagePath: data.url
        }));
      } catch (err) {
        console.error("Error uploading cover image:", err);
      }
    }
  };

  // 4. Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If deviceTypeId is "other", create a new device type
      let finalDeviceTypeId: number;
      if (formData.deviceTypeId === "other") {
        // POST to /api/DeviceType with newDeviceType
        const createTypeRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/DeviceType`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ typeName: newDeviceType })
        });
        if (!createTypeRes.ok) {
          throw new Error("Failed to create device type");
        }
        const newTypeObj = await createTypeRes.json();
        finalDeviceTypeId = newTypeObj.deviceTypeID; 
      } else {
        finalDeviceTypeId = parseInt(formData.deviceTypeId, 10);
      }

      // If manufacturerId is "other", create new manufacturer
      let finalManufacturerId: number;
      if (formData.manufacturerId === "other") {
        const createMfrRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/TechnologyManufacturer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newManufacturerName })
        });
        if (!createMfrRes.ok) {
          throw new Error("Failed to create manufacturer");
        }
        const newMfrObj = await createMfrRes.json();
        finalManufacturerId = newMfrObj.manufacturerID;
      } else {
        finalManufacturerId = parseInt(formData.manufacturerId, 10);
      }

      const finalTotalCopies = parseInt(formData.totalCopies, 10);
      const finalAvailableCopies = finalTotalCopies;

      // Build the final payload
      const payload = {
        Title: formData.title,
        DeviceTypeID: finalDeviceTypeId,
        ManufacturerID: finalManufacturerId,
        ModelNumber: formData.modelNumber,
        CoverImagePath: formData.coverImagePath,
        TotalCopies: finalTotalCopies,
        AvailableCopies: finalAvailableCopies,
        Location: formData.location,
        ItemTypeID: formData.itemTypeID
      };

      console.log("Final Technology Payload:", payload);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Technology/add-technology`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Something went wrong. Please try again.");
        return;
      }

      alert("Technology added successfully!");
      // Reset form
      setFormData({
        title: "",
        deviceTypeId: "",
        manufacturerId: "",
        modelNumber: "",
        coverImagePath: "",
        totalCopies: "",
        availableCopies: "",
        location: "",
        itemTypeID: 4
      });
      setNewDeviceType("");
      setNewManufacturerName("");
    } catch (err) {
      console.error("Error adding technology:", err);
      alert("Failed to add technology: " + err);
    }
  };

  return (
    <form className="technology-form" onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center" }}>Add New Technology</h2>
      <div className="form-grid">
        <input
          name="title"
          placeholder="Title (e.g., MacBook Pro)"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        
        {/* Device Type */}
        <select
          name="deviceTypeId"
          value={formData.deviceTypeId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Device Type</option>
          {deviceTypes.map((dt) => (
            <option key={dt.deviceTypeID} value={dt.deviceTypeID}>
              {dt.typeName}
            </option>
          ))}
          <option key="other-deviceType" value="other">Other</option>
        </select>
        {formData.deviceTypeId === "other" && (
          <input
            type="text"
            placeholder="New Device Type"
            value={newDeviceType}
            onChange={(e) => setNewDeviceType(e.target.value)}
            required
          />
        )}

        {/* Manufacturer */}
        <select
          name="manufacturerId"
          value={formData.manufacturerId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Manufacturer</option>
          {manufacturers.map((mfr) => (
            <option key={mfr.manufacturerID} value={mfr.manufacturerID}>
              {mfr.name}
            </option>
          ))}
          <option key="other-manufacturer" value="other">Other</option>
        </select>
        {formData.manufacturerId === "other" && (
          <input
            type="text"
            placeholder="New Manufacturer Name"
            value={newManufacturerName}
            onChange={(e) => setNewManufacturerName(e.target.value)}
            required
          />
        )}

        <input
          name="modelNumber"
          placeholder="Model Number"
          value={formData.modelNumber}
          onChange={handleInputChange}
          required
        />

        <input
          name="totalCopies"
          placeholder="Total Copies"
          type="number"
          value={formData.totalCopies}
          onChange={handleInputChange}
          required
        />
        <input
          name="location"
          placeholder="Location (e.g., Shelf T1)"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        {/* Cover image */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />


      </div>
      <button type="submit">Add Technology</button>
    </form>
  );
};

export default TechnologyForm;
