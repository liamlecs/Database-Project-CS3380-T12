import Calendar from 'react-calendar'
import { useState } from 'react';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function EventsCalendar() {
    const [value, onChange] = useState<Value>(new Date());
    return (
      <div>
        <h1 className='format'> here is the calendar</h1>
        <main>
          <Calendar onChange={onChange} showWeekNumbers value={value} />
        </main>
      </div>
    );
  }
  