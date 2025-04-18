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
    Typography,
    Box,
} from "@mui/material";
import { MusicDto } from "../../types"; // Adjust the path as needed

interface EditMusicDialogProps {
    open: boolean;
    editMusicForm: Partial<MusicDto>;
    artists: { musicArtistId: number; artistName: string }[];
    genres: { musicGenreId: number; description: string }[];
    setEditMusicForm: React.Dispatch<React.SetStateAction<Partial<MusicDto>>>;
    handleSaveEditMusic: () => void;
    onClose: () => void;
}

const EditMusicDialog: React.FC<EditMusicDialogProps> = ({
    open,
    editMusicForm,
    artists,
    genres,
    setEditMusicForm,
    handleSaveEditMusic,
    onClose,
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Music</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Title"
                        fullWidth
                        value={editMusicForm.title || ""}
                        onChange={(e) =>
                            setEditMusicForm((f) => ({ ...f, title: e.target.value }))
                        }
                    />
                    <TextField
                        label="Song ID"
                        fullWidth
                        type="number"
                        value={editMusicForm.songId ?? ""}
                        onChange={(e) =>
                            setEditMusicForm((f) => ({
                                ...f,
                                songId: Number(e.target.value),
                            }))
                        }
                    />
                    {/* Artist Select */}
                    <FormControl fullWidth>
                        <InputLabel>Artist</InputLabel>
                        <Select
                            value={editMusicForm.musicArtistID ?? ""}
                            label="Artist"
                            onChange={(e) =>
                                setEditMusicForm((f) => ({
                                    ...f,
                                    musicArtistID: Number(e.target.value),
                                }))
                            }
                        >
                            {artists.map((a) => (
                                <MenuItem key={a.musicArtistId} value={a.musicArtistId}>
                                    {a.artistName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Genre Select */}
                    <FormControl fullWidth>
                        <InputLabel>Genre</InputLabel>
                        <Select
                            value={editMusicForm.musicGenreID ?? ""}
                            label="Genre"
                            onChange={(e) =>
                                setEditMusicForm((f) => ({
                                    ...f,
                                    musicGenreID: Number(e.target.value),
                                }))
                            }
                        >
                            {genres.map((g) => (
                                <MenuItem key={g.musicGenreId} value={g.musicGenreId}>
                                    {g.description}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Format"
                        fullWidth
                        value={editMusicForm.format || ""}
                        onChange={(e) =>
                            setEditMusicForm((f) => ({ ...f, format: e.target.value }))
                        }
                    />
                    <TextField
                        label="Total Copies"
                        type="number"
                        fullWidth
                        value={editMusicForm.totalCopies ?? ""}
                        onChange={(e) =>
                            setEditMusicForm((f) => ({
                                ...f,
                                totalCopies: Number(e.target.value),
                            }))
                        }
                    />
                    <TextField
                        label="Available Copies"
                        type="number"
                        fullWidth
                        value={editMusicForm.availableCopies ?? ""}
                        onChange={(e) =>
                            setEditMusicForm((f) => ({
                                ...f,
                                availableCopies: Number(e.target.value),
                            }))
                        }
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        value={editMusicForm.location || ""}
                        onChange={(e) =>
                            setEditMusicForm((f) => ({ ...f, location: e.target.value }))
                        }
                    />
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Cover Image
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {editMusicForm.coverImagePath && (
                                <img
                                    src={editMusicForm.coverImagePath}
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
                                                `${import.meta.env.VITE_API_BASE_URL}/api/Music/upload-cover`,
                                                { method: "POST", body: form }
                                            );
                                            const { url } = await resp.json();
                                            setEditMusicForm((f) => ({ ...f, coverImagePath: url }));
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
                <Button variant="contained" color="primary" onClick={handleSaveEditMusic}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMusicDialog;
