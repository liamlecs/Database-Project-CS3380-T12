import { Autocomplete, Box, Stack, TextField } from "@mui/material";
import type { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";

class EventDetails {
  eventID?: number;
  startTimeStamp?: Date;
  endTimeStamp?: Date;
  location?: string;
  ageGroup?: string;
  categoryID?: string;
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
  getAgeGroup(): string | undefined {
    return this.ageGroup;
  }
  setAgeGroup(age: string): void {
    this.ageGroup = age;
  }

  // Getter and Setter for CategoryID
  getCategoryID(): string | undefined {
    return this.categoryID;
  }
  setCategoryID(category: string): void {
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

const locations = ["Melcher Hall", "Agnes Arnold"];

const ageGroups = ["0-5", "6-10", "11-15", "16+"];

const eventCategories = ["Educational", "Social", "Cultural"];

const trueFalse = ["True", "False"];

export default function CreateEvent() {
  const eventdetails = new EventDetails(); //must create an EventID generator eventually
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
          renderInput={(params) => <TextField {...params} label="Movie" />}
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
          renderInput={(params) => <TextField {...params} label="Movie" />}
          onChange={(event, newValue) => {
            if (newValue) {
              // Only call setName if newValue is not null
              eventdetails.setAgeGroup(newValue); // Update the selected name
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
          renderInput={(params) => <TextField {...params} label="Movie" />}
          onChange={(event, newValue) => {
            if (newValue) {
              // Only call setName if newValue is not null
              eventdetails.setCategoryID(newValue); // Update the selected name
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
          renderInput={(params) => <TextField {...params} label="Movie" />}
          onChange={(event, newValue) => {
            if (newValue) {
              // Only call setName if newValue is not null
              eventdetails.setLocation(newValue); // Update the selected name
              console.log("Updated Answer Object:", eventdetails);
            }
          }}
        />
      </div>
      <div className="centeredHor" style={{ marginTop: "20px" }}>
        <Button
          variant="outlined"
          href="EventsCalendar"
          onClick={() => {
            //include check later to make sure all questions are answered
            alert("clicked");
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
