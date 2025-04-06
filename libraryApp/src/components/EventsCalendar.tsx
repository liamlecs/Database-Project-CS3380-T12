import React, { Component } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import "react-big-calendar/lib/css/react-big-calendar.css";

//consider removing RSVP button

const localizer = dayjsLocalizer(dayjs);

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  description: string;
}

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Event`); // Adjust the URL to match your API endpoint
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
const  processedEvents = eventsArray.map((event: any) => ({
        title: event.title,
        description: event.description,
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
        <Dialog open={!!this.state.selectedEvent} onClose={this.handleClose}>
          {this.state.selectedEvent && (
            <>
              <DialogTitle>{this.state.selectedEvent.title}</DialogTitle>
              <DialogContent>
                <p>{this.state.selectedEvent.description}</p>
              </DialogContent>
              <DialogActions
                style={{ display: "flex", justifyContent: "flex-end" }} //change justifycontent back to spacebetween later
              >
                {/* RSVP Button (Left Side) 
                <Button
                  onClick={() => {
                    this.handleRSVP();
                    this.handleClose();
                  }}
                  color="primary"
                >
                  RSVP
                </Button>*/}

                {/* Close Button (Right Side) */}
                <Button onClick={this.handleClose} color="secondary">
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
