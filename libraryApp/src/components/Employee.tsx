import React, { useState, useEffect } from 'react';

// defining types
interface InventoryItem {
  id: string;
  title: string;
  status: string;
  type: 'book' | 'movie' | 'technology';
  author?: string; // if book
  director?: string; // if movie
  runtime?: number; // if movie
  manufacturer?: string; // if device
  model?: string; // if device
}

interface Event {
  id: string;
  eventName: string;
  eventDate: string;
  description: string;
}

interface BorrowerHistory {
  id: string;
  borrowerId: string;
  inventoryId: string;
  checkoutDate: string;
  returnDate: string;
}

const Employee: React.FC = () => {
  // state for current view
  const [currentView, setCurrentView] = useState<'dashboard' | 'inventory' | 'events' | 'borrowerHistory'>('dashboard');

  // state for inventory management
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryForm, setInventoryForm] = useState<Omit<InventoryItem, 'id'>>({
    type: 'book', // default is 'book'
    title: '',
    status: 'available',
    author: '', // book specific
    director: '', // movie specific
    runtime: 0, // movie specific
    manufacturer: '', // device specific
    model: '', // device specific
  });

  // event management state
  const [events, setEvents] = useState<Event[]>([]);
  const [eventForm, setEventForm] = useState<Omit<Event, 'id'>>({
    eventName: '',
    eventDate: '',
    description: '',
  });

  // state for borrower history
  const [borrowerHistory, setBorrowerHistory] = useState<BorrowerHistory[]>([]);
  const [borrowerId, setBorrowerId] = useState<string>('');

  // fetch inventory data (mock data)
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
        { id: '1', type: 'book', title: 'Fahrenheit 451', author: 'Ray Bradbury', status: 'available' },
        { id: '2', type: 'movie', title: 'The Hunger Games', director: 'Gary Ross', runtime: 97, status: 'available' },
        { id: '3', type: 'technology', title: 'Laptop', manufacturer: 'Apple', model: 'Macbook Air Model', status: 'checked out' },
      ];
    setInventory(mockInventory);
  }, []);

  // fetch events data (mock)
  useEffect(() => {
    const mockEvents: Event[] = [
      { id: '1', eventName: 'Book Fair', eventDate: '2025-03-25', description: 'Book fair event.' },
    ];
    setEvents(mockEvents);
  }, []);

  // adding inventory item
  const handleAddInventory = () => {
    const newItem: InventoryItem = { ...inventoryForm, id: String(inventory.length + 1) };
    setInventory([...inventory, newItem]);
    setInventoryForm({ 
        type: 'book',
        title: '', 
        status: 'available',
        author: '',
        director: '',
        runtime: 0,
        manufacturer: '',
        model: '',
     });
  };

  // Handle deleting inventory item
  const handleDeleteInventory = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  // Render the inventory form based on the selected type
  const renderInventoryForm = () => {
    switch (inventoryForm.type) {
      case 'book':
        return (
          <>
            <input
              type="text"
              placeholder="Author"
              value={inventoryForm.author}
              onChange={(e) => setInventoryForm({ ...inventoryForm, author: e.target.value })}
            />
          </>
        );
      case 'movie':
        return (
          <>
            <input
              type="text"
              placeholder="Director"
              value={inventoryForm.director}
              onChange={(e) => setInventoryForm({ ...inventoryForm, director: e.target.value })}
            />
            <input
              type="number"
              placeholder="Runtime (minutes)"
              value={inventoryForm.runtime}
              onChange={(e) => setInventoryForm({ ...inventoryForm, runtime: Number(e.target.value) })}
            />
          </>
        );
      case 'technology':
        return (
          <>
            <input
              type="text"
              placeholder="Manufacturer"
              value={inventoryForm.manufacturer}
              onChange={(e) => setInventoryForm({ ...inventoryForm, manufacturer: e.target.value })}
            />
            <input
              type="text"
              placeholder="Model"
              value={inventoryForm.model}
              onChange={(e) => setInventoryForm({ ...inventoryForm, model: e.target.value })}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Render the inventory management section
  const renderInventoryManagement = () => {
    return (
      <div>
        <h2>Inventory Management</h2>
        <div>
          <select
            value={inventoryForm.type}
            onChange={(e) => setInventoryForm({ ...inventoryForm, type: e.target.value as 'book' | 'movie' | 'technology' })}
          >
            <option value="book">Book</option>
            <option value="movie">Movie</option>
            <option value="technology">Technology</option>
          </select>
          <input
            type="text"
            placeholder="Title"
            value={inventoryForm.title}
            onChange={(e) => setInventoryForm({ ...inventoryForm, title: e.target.value })}
          />
          {renderInventoryForm()}
          <button onClick={handleAddInventory}>Add Item</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Details</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.type}</td>
                <td>{item.title}</td>
                <td>
                  {item.type === 'book' && `Author: ${item.author}`}
                  {item.type === 'movie' && `Director: ${item.director}, Runtime: ${item.runtime} mins`}
                  {item.type === 'technology' && `Manufacturer: ${item.manufacturer}, Model: ${item.model}`}
                </td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleDeleteInventory(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Handle adding event
  const handleAddEvent = () => {
    const newEvent: Event = { ...eventForm, id: String(events.length + 1) };
    setEvents([...events, newEvent]);
    setEventForm({ eventName: '', eventDate: '', description: '' });
  };

  // Handle fetching borrower history
  const handleFetchBorrowerHistory = () => {
    const mockHistory: BorrowerHistory[] = [
      { id: '1', borrowerId, inventoryId: '1', checkoutDate: '2025-03-01', returnDate: '2025-03-15' },
    ];
    setBorrowerHistory(mockHistory);
  };

  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard</h2>
            <p>Total Items: {inventory.length}</p>
            <p>Upcoming Events: {events.length}</p>
          </div>
        );

      case 'inventory':
        return renderInventoryManagement();

      case 'events':
        return (
          <div>
            <h2>Event Management</h2>
            <div>
              <input
                type="text"
                placeholder="Event Name"
                value={eventForm.eventName}
                onChange={(e) => setEventForm({ ...eventForm, eventName: e.target.value })}
              />
              <input
                type="date"
                placeholder="Event Date"
                value={eventForm.eventDate}
                onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              />
              <button onClick={handleAddEvent}>Add Event</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.eventName}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'borrowerHistory':
        return (
          <div>
            <h2>Borrower History</h2>
            <div>
              <input
                type="text"
                placeholder="Enter Borrower ID"
                value={borrowerId}
                onChange={(e) => setBorrowerId(e.target.value)}
              />
              <button onClick={handleFetchBorrowerHistory}>Search</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Borrower ID</th>
                  <th>Inventory ID</th>
                  <th>Checkout Date</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {borrowerHistory.map((record) => (
                  <tr key={record.id}>
                    <td>{record.borrowerId}</td>
                    <td>{record.inventoryId}</td>
                    <td>{record.checkoutDate}</td>
                    <td>{record.returnDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li><button onClick={() => setCurrentView('dashboard')}>Dashboard</button></li>
          <li><button onClick={() => setCurrentView('inventory')}>Inventory</button></li>
          <li><button onClick={() => setCurrentView('events')}>Events</button></li>
          <li><button onClick={() => setCurrentView('borrowerHistory')}>Borrower History</button></li>
        </ul>
      </nav>
      <div className="employee-container">
        {renderView()}
      </div>
    </div>
  );
};

export default Employee;