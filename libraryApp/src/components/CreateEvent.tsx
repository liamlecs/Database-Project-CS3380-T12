import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from "@mui/material";
import type { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

class EventDetails {
  eventID?: number;
  startTimeStamp!: Date;
  endTimeStamp!: Date;
  location?: string;
  ageGroup?: number;
  categoryID?: number;
  isPrivate?: boolean;
  title?: string;
  description?: string;

  getEventID(): number | undefined {
    return this.eventID;
  }
  setEventID(id: number): void {
    this.eventID = id;
  }

  // Getter and Setter for StartTimeStamp
  getStartTimeStamp(): Date {
    return this.startTimeStamp;
  }
  setStartTimeStamp(start: Date): void {
    this.startTimeStamp = start;
  }

  // Getter and Setter for EndTimeStamp
  getEndTimeStamp(): Date {
    return this.endTimeStamp;
  }
  setEndTimeStamp(end: Date): void {
    this.endTimeStamp = end;
  }

  // Getter and Setter for Location
  getLocation(): string | undefined {
    return this.location;
  }
  setLocation(loc: string): void {
    this.location = loc;
  }

  // Getter and Setter for AgeGroup
  getAgeGroup(): number | undefined {
    return this.ageGroup;
  }
  setAgeGroup(age: number): void {
    this.ageGroup = age;
  }

  // Getter and Setter for CategoryID
  getCategoryID(): number | undefined {
    return this.categoryID;
  }
  setCategoryID(category: number): void {
    this.categoryID = category;
  }

  // Getter and Setter for isPrivate
  getIsPrivate(): boolean | undefined {
    return this.isPrivate;
  }
  setIsPrivate(privateStatus: boolean): void {
    this.isPrivate = privateStatus;
  }

  getTitle(): string | undefined {
    return this.title;
  }
  setTitle(loc: string): void {
    this.title = loc;
  }

  getDescription(): string | undefined {
    return this.description;
  }
  setDescription(loc: string): void {
    this.description = loc;
  }
}

const locations = ["Melcher Hall", "Agnes Arnold"];

const ageGroups = ["0-2", "3-8", "9-13", "14-17", "18+"];

const eventCategories = ["Educational", "Social", "Cultural"];

const trueFalse = ["True", "False"];

const eventdetails = new EventDetails(); //must create an EventID generator eventually
eventdetails.setEventID(0); //temp generator

export default function CreateEvent() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openExitDialog, setOpenExitDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();


const handleSubmit = async () => {
  
  if(eventdetails.getStartTimeStamp()==null||eventdetails.getEndTimeStamp()==null||eventdetails.getLocation()===""||eventdetails.getAgeGroup()==null||eventdetails.getCategoryID()==null||eventdetails.getIsPrivate()==null||eventdetails.getTitle()==null||eventdetails.getTitle()===""||eventdetails.getDescription()==null||eventdetails.getDescription()===""){

    //this is where the dialogue popup would go
    setDialogMessage("Please fill in all required fields before submitting.");
    setOpenDialog(true); // Open the dialog if any field is missing
    return;
  }
  
  if(eventdetails.getStartTimeStamp()<=dayjs().toDate()){
    setDialogMessage("The event start time must be in the future.");
    setOpenDialog(true); // Open the dialog if start time is before current time
    return;

  }

  if(eventdetails.getStartTimeStamp()>eventdetails.getEndTimeStamp()){
    setDialogMessage("The event start time cannot be after the end time.");
    setOpenDialog(true); // Open the dialog if start time after end time
    return;

  }


  const eventData = {
    eventId: eventdetails.getEventID(), // Should be an integer
    startTimeStamp: eventdetails.getStartTimeStamp()?.toISOString(), // Convert Date to String
    endTimeStamp: eventdetails.getEndTimeStamp()?.toISOString(), // Convert Date to String
    location: eventdetails.getLocation(), // Ensure it's a string
    ageGroup: eventdetails.getAgeGroup(), // Default to 0 if null
    categoryId: eventdetails.getCategoryID(), // Default to 0 if null
    isPrivate: eventdetails.getIsPrivate(),
    title: eventdetails.getTitle(),
    description: eventdetails.getDescription(),
  };

  try {
    const response = await fetch("http://localhost:5217/api/Event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (response.ok) {
        setDialogMessage("Your event was successfully submitted!");
    setOpenExitDialog(true);
      console.log("Event created successfully!");
    } else {
      const errorData = await response.json();
      console.error("Error creating event:", errorData);
      alert("Failed to create event.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Network error. Please try again.");
  }



};




  return (
    <div className="format">
      <div
        style={{
          textAlign: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Stack direction="column">
          <div className="centeredHor">
          <h2 style={{ marginTop: "20px" }}>When is your Event?</h2>
          </div>
          <Stack direction="row" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Time"
                sx={{ width: "225px" }}
                onChange={(newValue: Dayjs | null) => {
                  eventdetails.setStartTimeStamp(
                    newValue ? newValue.toDate() : new Date()
                  );
                  console.log("Updated Answer Object:", eventdetails);
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="End Time"
                sx={{ width: "225px" }}
                onChange={(newValue: Dayjs | null) => {
                  eventdetails.setEndTimeStamp(
                    newValue ? newValue.toDate() : new Date()
                  );
                  console.log("Updated Answer Object:", eventdetails);
                }}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>
      </div>
      <div className="centeredHor">
        <h2 style={{ marginTop: "20px" }}>What Building?</h2>
      </div>
      <div className="centeredHor">
        <Autocomplete
          disablePortal
          options={locations}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} />}
          onChange={(event, newValue) => {
            if (newValue) {
              // Only call setName if newValue is not null
              eventdetails.setLocation(newValue); // Update the selected name
              console.log("Updated Answer Object:", eventdetails);
            }
          }}
        />
      </div>

        <h2 className="centeredHor">What Age Group?</h2>

      <div className="centeredHor">
        <Autocomplete
          disablePortal
          options={ageGroups}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} />}
          onChange={(event, newValue) => {
            if (newValue) {
              switch (newValue) {
                case "0-2":
                  eventdetails.setAgeGroup(1);
                  break;
                case "3-8":
                  eventdetails.setAgeGroup(2);
                  break;
                case "9-13":
                  eventdetails.setAgeGroup(3);
                  break;
                case "14-17":
                  eventdetails.setAgeGroup(4);
                  break;
                case "18+":
                  eventdetails.setAgeGroup(5);
              }
              console.log("Updated Answer Object:", eventdetails);
            }
          }}
        />
      </div>
      <div className="centeredHor">
        <h2 style={{ marginTop: "20px" }}>What Type of Event Will It Be?</h2>
      </div>
      <div className="centeredHor">
        <Autocomplete
          disablePortal
          options={eventCategories}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} />}
          onChange={(event, newValue) => {
            if (newValue) {
              switch (newValue) {
                case "Educational":
                  eventdetails.setCategoryID(1);
                  break;
                case "Social":
                  eventdetails.setCategoryID(2);
                  break;
                case "Cultural":
                  eventdetails.setCategoryID(3);
                  break;
              }

              console.log("Updated Answer Object:", eventdetails);
            }
          }}
        />
      </div>
      <div className="centeredHor">
        <h2 style={{ marginTop: "20px" }}>Will this be a private event?</h2>
      </div>
      <div className="centeredHor">
        <Autocomplete
          disablePortal
          options={trueFalse}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} />}
          onChange={(event, newValue) => {
            if (newValue) {
              if (newValue === "True") eventdetails.setIsPrivate(true);
              else eventdetails.setIsPrivate(false);
              console.log("Updated Answer Object:", eventdetails);
            }
          }}
        />
      </div>
      <div className="centeredHor">
      <h2>What is the title of your event?</h2>
      </div>
      <div className="centeredHor">
        <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
              eventdetails.setTitle(newValue);
              console.log("Updated Answer Object:", eventdetails);
          }}
        />
      </div>
      <h2 className="centeredHor">What is the description for your event?</h2>
      <div className="centeredHor" style={{ marginTop: "20px" }}>
        <TextField
          id="multiline"
          multiline
          minRows={2}
          maxRows={6}
          sx={{width:"45ch"}}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
              eventdetails.setDescription(newValue);
              console.log("Updated Answer Object:", eventdetails);
          }}
        />
      </div>
      <div className="centeredHor" style={{ marginTop: "20px" }}>
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      {/* Dialog Box for Missing Fields */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Form Incomplete</DialogTitle>
        <DialogContent>
        <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openExitDialog} onClose={() => {setOpenDialog(false); navigate("/EventsCalendar");}}>
        <DialogTitle>Form Complete</DialogTitle>
        <DialogContent>
        <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpenDialog(false); navigate("/EventsCalendar");}} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

