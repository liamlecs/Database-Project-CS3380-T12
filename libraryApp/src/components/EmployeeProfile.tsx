import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Divider,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { People as PeopleIcon, Edit as EditIcon, Lock as LockIcon } from '@mui/icons-material';

interface EmployeeProfileProps {
  employeeData: {
    employeeId: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    supervisorID?: number;
    username: string;
    password?: string;
  };
  onUpdate: (updatedData: any) => void;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employeeData, onUpdate }) => {
  const theme = useTheme();
  const [editMode, setEditMode] = React.useState(false);
  const [changePasswordMode, setChangePasswordMode] = React.useState(false);
  const [formData, setFormData] = React.useState(employeeData);
  const [passwordForm, setPasswordForm] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };


  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    localStorage.setItem("employeeFirstName", formData.firstName);
    localStorage.setItem("employeeLastName", formData.lastName);
    onUpdate(formData);
    setEditMode(false);
  };

  const handlePasswordSubmit = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert("New passwords don't match!");
        return;
      }
  
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee/${employeeData.employeeId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        })
      });

      if (response.status === 204) { // Handle No Content
        alert("Password updated successfully!");
        setChangePasswordMode(false);
        return;
      }

      const data = await response.json(); // Only parse if content exists
      if (!response.ok) throw new Error(data.message);
  
      alert("Password updated successfully!");
      setChangePasswordMode(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Password update failed. Please try again.");
      }
    }
  };
  

  return (
    <>
      <Paper elevation={3} sx={{ 
        padding: 3, 
        borderRadius: 4,
        background: theme.palette.background.paper,
        position: 'relative'
      }}>
        <Button 
          startIcon={<EditIcon />}
          onClick={() => setEditMode(true)}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          Edit
        </Button>
        <Button 
            startIcon={<LockIcon />}
            onClick={() => setChangePasswordMode(true)}
            sx={{ position: 'absolute', right: 90, top: 16 }}
          >
            Change Password
        </Button>
        

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          mb: 3
        }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80,
            bgcolor: theme.palette.primary.main
          }}>
            <PeopleIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
              {employeeData.firstName} {employeeData.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Employee ID: {employeeData.employeeId}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body1" sx={{ width: 120, fontWeight: 500 }}>
              First Name:
            </Typography>
            <Typography variant="body1">
              {employeeData.firstName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body1" sx={{ width: 120, fontWeight: 500 }}>
              Last Name:
            </Typography>
            <Typography variant="body1">
              {employeeData.lastName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body1" sx={{ width: 120, fontWeight: 500 }}>
              Birth Date:
            </Typography>
            <Typography variant="body1">
              {new Date(employeeData.birthDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Birth Date"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={changePasswordMode} onClose={() => setChangePasswordMode(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <TextField
            fullWidth
            type="password"
            label="Old Password"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
            error={passwordForm.newPassword !== passwordForm.confirmPassword}
            helperText={passwordForm.newPassword !== passwordForm.confirmPassword && "Passwords do not match"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordMode(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordSubmit}
            color="primary"
            disabled={!passwordForm.oldPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeProfile;