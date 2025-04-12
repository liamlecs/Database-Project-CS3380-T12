import React, { Component } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Stack, Box } from "@mui/material";

const localizer = dayjsLocalizer(dayjs);

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  description: string;
  location: string;
  ageGroup: string;
  isPrivate: boolean;
  categoryDescription: string;
}

// Helper to map numeric ageGroup to label
const mapAgeGroup = (ageGroupId: number): string => {
  switch (ageGroupId) {
    case 1:
      return "0-2";
    case 2:
      return "3-8";
    case 3:
      return "9-13";
    case 4:
      return "14-17";
    case 5:
      return "18+";
    default:
      return "Unknown";
  }
};

type EventsCalendarState = {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
};

class EventsCalendar extends Component<{}, EventsCalendarState> {
  state: EventsCalendarState = {
    events: [],
    selectedEvent: null,
  };

  async componentDidMount() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Event/EventCalendar`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const events = await response.json();
      console.log("API Response:", events);

      // Map backend data to local CalendarEvent structure
      const processedEvents = events.map((event: any) => ({
        title: event.title,
        description: event.description,
        location: event.location,
        isPrivate: event.isPrivate,
        ageGroup: mapAgeGroup(event.ageGroup),
        categoryDescription: event.categoryDescription,
        start: dayjs(event.startTimestamp).toDate(),
        end: dayjs(event.endTimestamp).toDate(),
      }));

      console.log("Processed Events:", processedEvents);
      this.setState({ events: processedEvents });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  handleSelectEvent = (event: CalendarEvent) => {
    this.setState({ selectedEvent: event });
  };

  handleClose = () => {
    this.setState({ selectedEvent: null });
  };

  render() {
    return (
      <Box
        sx={{
          // Add top margin so the global NavBar won't cover the calendar
          mt: "80px", 
          // optionally add horizontal padding if you want
          mx: "auto",
          // limiting maxWidth can keep it centered on wide screens
          maxWidth: 1200,
        }}
      >
        {/* The Calendar itself */}
        <div style={{ height: "85vh" }}>
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={this.state.events}
            style={{ height: "100%", width: "100%" }}
            onSelectEvent={this.handleSelectEvent}
          />
        </div>

        {/* Event Details Dialog */}
        <Dialog
          open={!!this.state.selectedEvent}
          onClose={this.handleClose}
          PaperProps={{
            sx: {
              minWidth: 500,
              minHeight: 350,
            },
          }}
        >
          {this.state.selectedEvent && (
            <>
              <DialogTitle style={{ fontWeight: "bold", color: "darkblue" }}>
                {this.state.selectedEvent.title} —{" "}
                {dayjs(this.state.selectedEvent.start).format("MMMM D") ===
                dayjs(this.state.selectedEvent.end).format("MMMM D")
                  ? `${dayjs(this.state.selectedEvent.start).format(
                      "MMMM D, h:mm A"
                    )} - ${dayjs(this.state.selectedEvent.end).format(
                      "h:mm A"
                    )}`
                  : `${dayjs(this.state.selectedEvent.start).format(
                      "MMMM D, h:mm A"
                    )} - ${dayjs(this.state.selectedEvent.end).format(
                      "MMMM D, h:mm A"
                    )}`}
              </DialogTitle>
              <DialogContent>
                <p>
                  <strong>Location:</strong>{" "}
                  {this.state.selectedEvent.location}
                </p>
                <p>{this.state.selectedEvent.description}</p>
                {this.state.selectedEvent.isPrivate && (
                  <p
                    style={{
                      fontStyle: "italic",
                      color: "red",
                    }}
                  >
                    This is a private event
                  </p>
                )}
              </DialogContent>
              <DialogActions
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  width: "100%",
                  mt: "auto",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: "100%", pr: 2 }}
                >
                  <Stack direction="column" spacing={0.5}>
                    <p style={{ fontWeight: "bold", margin: 0 }}>
                      Intended Age Group
                    </p>
                    <p style={{ margin: 0 }}>
                      {this.state.selectedEvent.ageGroup}
                    </p>
                  </Stack>
                  <Stack direction="column" spacing={0.5}>
                    <p style={{ fontWeight: "bold", margin: 0 }}>Category</p>
                    <p style={{ margin: 0 }}>
                      {this.state.selectedEvent.categoryDescription}
                    </p>
                  </Stack>
                </Stack>
                <Button onClick={this.handleClose} color="secondary" variant="outlined">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    );
  }
}

export default EventsCalendar;
