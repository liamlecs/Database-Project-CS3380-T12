import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    Typography
} from "@mui/material";
import { TechnologyDto } from "../../types";

interface EditTechnologyDialogProps {
    open: boolean;
    editTechnologyForm: Partial<TechnologyDto>;
    deviceTypes: { deviceTypeID: number; typeName: string }[];
    manufacturers: { manufacturerID: number; name: string }[];
    newDeviceType: string;
    newManufacturerName: string;
    setEditTechnologyForm: React.Dispatch<React.SetStateAction<Partial<TechnologyDto>>>;
    setNewDeviceType: React.Dispatch<React.SetStateAction<string>>;
    setNewManufacturerName: React.Dispatch<React.SetStateAction<string>>;
    handleSaveEditTechnology: () => void;
    onClose: () => void;
}

const EditTechnologyDialog: React.FC<EditTechnologyDialogProps> = ({
    open,
    editTechnologyForm,
    deviceTypes,
    manufacturers,
    newDeviceType,
    newManufacturerName,
    setEditTechnologyForm,
    setNewDeviceType,
    setNewManufacturerName,
    handleSaveEditTechnology,
    onClose,
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Technology</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {/* Title */}
                    <TextField
                        label="Title"
                        fullWidth
                        value={editTechnologyForm.title || ""}
                        onChange={(e) =>
                            setEditTechnologyForm((f) => ({ ...f, title: e.target.value }))
                        }
                    />

                    {/* Device Type Dropdown with "Other" */}
                    <FormControl fullWidth>
                        <InputLabel>Device Type</InputLabel>
                        <Select
                            value={editTechnologyForm.deviceTypeName || "other"}
                            label="Device Type"
                            onChange={(e) => {
                                const selectedValue = e.target.value as string;
                                if (selectedValue === "other") {
                                    setEditTechnologyForm((f) => ({
                                        ...f,
                                        deviceTypeName: "other",
                                    }));
                                } else {
                                    const selectedDeviceType = deviceTypes.find(
                                        (d) => d.deviceTypeID === Number(selectedValue)
                                    );
                                    if (selectedDeviceType) {
                                        setEditTechnologyForm((f) => ({
                                            ...f,
                                            deviceTypeName: selectedDeviceType.deviceTypeID.toString(),
                                        }));
                                    }
                                }
                            }}
                        >
                            {deviceTypes.map((d) => (
                                <MenuItem key={d.deviceTypeID} value={d.deviceTypeID}>
                                    {d.typeName}
                                </MenuItem>
                            ))}
                            <MenuItem value="other">Other...</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Input for new device type when "Other" is selected */}
                    {editTechnologyForm.deviceTypeName === "other" && (
                        <TextField
                            label="New Device Type"
                            fullWidth
                            value={newDeviceType}
                            onChange={(e) => setNewDeviceType(e.target.value)}
                        />
                    )}

                    {/* Manufacturer Dropdown with "Other" */}
                    <FormControl fullWidth>
                        <InputLabel>Manufacturer</InputLabel>
                        <Select
                            value={editTechnologyForm.manufacturerName || "other"}
                            label="Manufacturer"
                            onChange={(e) => {
                                const selectedValue = e.target.value as string;
                                if (selectedValue === "other") {
                                    setEditTechnologyForm((f) => ({
                                        ...f,
                                        manufacturerName: "other",
                                    }));
                                } else {
                                    const selectedManufacturer = manufacturers.find(
                                        (m) => m.manufacturerID === Number(selectedValue)
                                    );
                                    if (selectedManufacturer) {
                                        setEditTechnologyForm((f) => ({
                                            ...f,
                                            manufacturerName: selectedManufacturer.manufacturerID.toString(),
                                        }));
                                    }
                                }
                            }}
                        >
                            {manufacturers.map((m) => (
                                <MenuItem key={m.manufacturerID} value={m.manufacturerID}>
                                    {m.name}
                                </MenuItem>
                            ))}
                            <MenuItem value="other">Other...</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Input for new manufacturer when "Other" is selected */}
                    {editTechnologyForm.manufacturerName === "other" && (
                        <TextField
                            label="New Manufacturer Name"
                            fullWidth
                            value={newManufacturerName}
                            onChange={(e) => setNewManufacturerName(e.target.value)}
                        />
                    )}

                    {/* Model */}
                    <TextField
                        label="Model Number"
                        fullWidth
                        value={editTechnologyForm.modelNumber || ""}
                        onChange={(e) =>
                            setEditTechnologyForm((f) => ({ ...f, modelNumber: e.target.value }))
                        }
                    />
                    
                    {/* Total Copies */}
                    <TextField
                        label="Total Copies"
                        type="number"
                        fullWidth
                        value={editTechnologyForm.totalCopies ?? ""}
                        onChange={(e) =>
                            setEditTechnologyForm((f) => ({
                                ...f,
                                totalCopies: Number(e.target.value),
                            }))
                        }
                    />

                    {/* Available Copies */}
                    <TextField
                        label="Available Copies"
                        type="number"
                        fullWidth
                        value={editTechnologyForm.availableCopies ?? ""}
                        onChange={(e) =>
                            setEditTechnologyForm((f) => ({
                                ...f,
                                availableCopies: Number(e.target.value),
                            }))
                        }
                    />

                    {/* Location */}
                    <TextField
                        label="Location"
                        fullWidth
                        value={editTechnologyForm.location || ""}
                        onChange={(e) =>
                            setEditTechnologyForm((f) => ({ ...f, location: e.target.value }))
                        }
                    />

                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Cover Image
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {editTechnologyForm.coverImagePath && (
                                <img
                                    src={editTechnologyForm.coverImagePath}
                                    alt="cover preview"
                                    style={{ width: 50, height: 75, objectFit: "cover" }}
                                />
                            )}
                            <Button variant="outlined" component="label" size="small">
                                Choose Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const form = new FormData();
                                        form.append("Cover", file);
                                        try {
                                            const resp = await fetch(
                                                `${import.meta.env.VITE_API_BASE_URL}/api/Book/upload-cover`,
                                                { method: "POST", body: form }
                                            );
                                            const { url } = await resp.json();
                                            setEditTechnologyForm((f) => ({ ...f, coverImagePath: url }));
                                        } catch (err) {
                                            console.error("Upload failed", err);
                                        }
                                    }}
                                />
                            </Button>
                        </Box>
                    </Box>
                    
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSaveEditTechnology}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTechnologyDialog;