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
import { MusicDto } from "../../types";

interface EditMusicDialogProps {
    open: boolean;
    editMusicForm: Partial<MusicDto>;
    artists: { musicArtistId: number; artistName: string }[];
    newArtistName: string;
    musicGenres: { musicGenreId: number; description: string }[];
    setEditMusicForm: React.Dispatch<React.SetStateAction<Partial<MusicDto>>>;
    setNewArtistName: React.Dispatch<React.SetStateAction<string>>;
    handleSaveEditMusic: () => void;
    onClose: () => void;
}

const EditMusicDialog: React.FC<EditMusicDialogProps> = ({
    open,
    editMusicForm,
    artists,
    newArtistName,
    setNewArtistName,
    musicGenres,
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
                    {/*Music Artist Dropdown with Other*/}
                        <FormControl fullWidth>
                        <InputLabel>Artist</InputLabel>
                        <Select
                            value={editMusicForm.artistName || "other"}
                            label="Artist"
                            onChange={(e) => {
                            const selectedValue = e.target.value as string;
                            if (selectedValue === "other") {
                                setEditMusicForm((f) => ({
                                ...f,
                                artistName: "other",
                                }));
                            } else {
                                const selectedArtist = artists.find(
                                (a) => a.musicArtistId === Number(selectedValue)
                                );
                                if (selectedArtist) {
                                setEditMusicForm((f) => ({
                                    ...f,
                                    artistName: selectedArtist.musicArtistId.toString(),
                                }));
                                }
                            }
                            }}
                        >
                            {artists.map((a) => (
                            <MenuItem key={a.musicArtistId} value={a.musicArtistId}>
                                {a.artistName}
                            </MenuItem>
                            ))}
                            <MenuItem value="other">Other...</MenuItem>
                        </Select>
                        </FormControl>

                        {/* Input fields for new artist when "Other" is selected */}
                        {editMusicForm.artistName === "other" && (
                        <TextField
                            label="New Artist Name"
                            fullWidth
                            value={newArtistName}
                            onChange={(e) => setNewArtistName(e.target.value)}
                        />
                        )}

                    {/*Genre Dropdown*/}
                    <FormControl fullWidth>
                    <InputLabel>Genre</InputLabel>
                    <Select
                        value={editMusicForm.genreDescription || ""}
                        label="Genre"
                        onChange={(e) => {
                        const selectedGenreId = e.target.value as string;
                        setEditMusicForm((f) => ({
                            ...f,
                            genreDescription: selectedGenreId,
                        }));
                        }}
                    >
                        {musicGenres.map((g) => (
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
                                                `${import.meta.env.VITE_API_BASE_URL}/api/Book/upload-cover`,
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