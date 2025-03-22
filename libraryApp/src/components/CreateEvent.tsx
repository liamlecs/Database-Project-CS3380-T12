import { Autocomplete, Box, Stack, TextField } from "@mui/material";
import type { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import { createRandomNumberGenerator } from "@mui/x-data-grid/internals";

class EventDetails {
  eventID?: number;
  startTimeStamp?: Date;
  endTimeStamp?: Date;
  location?: string;
  ageGroup?: number;
  categoryID?: number;
  isPrivate?: boolean;

  getEventID(): number | undefined {
    return this.eventID;
  }
  setEventID(id: number): void {
    this.eventID = id;
  }

  // Getter and Setter for StartTimeStamp
  getStartTimeStamp(): Date | undefined {
    return this.startTimeStamp;
  }
  setStartTimeStamp(start: Date): void {
    this.startTimeStamp = start;
  }

  // Getter and Setter for EndTimeStamp
  getEndTimeStamp(): Date | undefined {
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
}

const eventdetails = new EventDetails(); //must create an EventID generator eventually
eventdetails.setEventID(Math.random() * 999999999999999);

const handleSubmit = async () => {
  const eventData = {
    eventID: eventdetails.getEventID(),
    startTimeStamp: eventdetails.getStartTimeStamp(),
    endTimeStamp: eventdetails.getEndTimeStamp(),
    location: eventdetails.getLocation(),
    ageGroup: eventdetails.getAgeGroup(),
    categoryID: eventdetails.getCategoryID(),
    isPrivate: eventdetails.getIsPrivate(),
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
      alert("Event created successfully!");
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

const locations = ["Melcher Hall", "Agnes Arnold"];

const ageGroups = ["0-2", "3-8", "9-13", "14-17", "18+"];

const eventCategories = ["Educational", "Social", "Cultural"];

const trueFalse = ["True", "False"];

export default function CreateEvent() {
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
          <h2 style={{ marginTop: "20px" }}>When is your Event?</h2>
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
      <div className="centeredHor">
        <h2 style={{ marginTop: "20px" }}>What Age Group?</h2>
      </div>
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
              if(newValue==="True")
              eventdetails.setIsPrivate(true);
            else
            eventdetails.setIsPrivate(false);
              console.log("Updated Answer Object:", eventdetails);
            }
          }}
        />
      </div>
      <div className="centeredHor" style={{ marginTop: "20px" }}>
        <Button variant="outlined" href="EventsCalendar" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
