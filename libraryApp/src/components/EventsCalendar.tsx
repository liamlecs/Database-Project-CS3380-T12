import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  description: string;
}

class EventsCalendar extends Component<
  {},
  { events: CalendarEvent[]; selectedEvent: CalendarEvent | null }
> {
  state = {
    events: [
      {
        start: moment().toDate(),
        end: moment().add(1, "days").toDate(),
        title: "Some title",
        description: "This is a detailed description of the event.",
      },
    ],
    selectedEvent: null as CalendarEvent | null,
  };

  handleSelectEvent = (event: CalendarEvent) => {
    this.setState({ selectedEvent: event });
  };

  handleClose = () => {
    this.setState({ selectedEvent: null });
  };

  handleRSVP = () => {
    if (this.state.selectedEvent) {
      alert(`RSVP confirmed for: ${this.state.selectedEvent.title}`);
    }
  };

  render() {
    return (
      <>
        <div className="centeredHor">
          <Button variant="text" href="/CreateEvent">
            Create An Event
          </Button>
        </div>
        <div className="App">
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={this.state.events}
            style={{ height: "100vh" }}
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
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {/* RSVP Button (Left Side) */}
                <Button
                  onClick={() => {
                    this.handleRSVP();
                    this.handleClose();
                  }}
                  color="primary"
                  
                >
                  RSVP
                </Button>

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
