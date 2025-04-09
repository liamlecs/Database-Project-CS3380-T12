import React, { Component } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Stack } from "@mui/material";

//consider removing RSVP button

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

class EventsCalendar extends Component<
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  {},
  { events: CalendarEvent[]; selectedEvent: CalendarEvent | null }
> {
  state = {
    events: [],
    selectedEvent: null as CalendarEvent | null,
  };

  // Fetch events from the backend when the component mounts
  async componentDidMount() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Event/EventCalendar`
      ); // Adjust the URL to match your API endpoint
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const events = await response.json();
      console.log("API Response:", events);

      const eventsArray = events; //this code is fucking frankensteins monster atp, im afraid to try to streamline it and break something.

      // Assuming the response is in the correct format to match CalendarEvent structure
      /*this.setState({
        // biome-ignore lint/suspicious/noExplicitAny: <circle back later and define a type>
        events: eventsArray.map((event: any) => {
          return {
            start: dayjs(event.startTimestamp).toDate(),
            end: dayjs(event.endTimestamp).toDate(),
            title: event.title, // Assuming title is part of your event
            description: event.description, // Assuming description is part of your event
          };
        }),
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    }*/

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const processedEvents = eventsArray.map((event: any) => ({
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

  /*handleRSVP = () => {
    if (this.state.selectedEvent) {
      alert(`RSVP confirmed for: ${this.state.selectedEvent.title}`);
    }
  };*/

  render() {
    return (
      <>
        <div className="App">
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={this.state.events}
            style={{ height: "85vh" }}
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
    ? `${dayjs(this.state.selectedEvent.start).format("MMMM D, h:mm A")} - ${dayjs(
        this.state.selectedEvent.end
      ).format("h:mm A")}`
    : `${dayjs(this.state.selectedEvent.start).format("MMMM D, h:mm A")} - ${dayjs(
        this.state.selectedEvent.end
      ).format("MMMM D, h:mm A")}`}
</DialogTitle>
              <DialogContent>
                <p> <strong>Location:</strong> {this.state.selectedEvent.location}</p>

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
    mt: "auto", // push it to the bottom if wrapped in a flex parent
  }}
>
  <Stack direction="row" justifyContent="space-between" sx={{ width: "100%", pr: 2 }}>
    <Stack direction="column" spacing={0.5}>
      <p style={{fontWeight: "bold", margin: 0 }}>Intended Age Group</p>
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
      </>
    );
  }
}

export default EventsCalendar;
