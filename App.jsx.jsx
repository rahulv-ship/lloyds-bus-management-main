import React, { useState, useEffect, useRef } from 'react';
import './BusPassSystem.css';

// ---------------------------------------------------------------------------
// Main App Component
// ---------------------------------------------------------------------------
const BusPassSystem = () => {
  const [activeView, setActiveView] = useState('new-request');

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="app">
      {/* App Navigation Tabs */}
      <nav className="app-nav">
        <button
          className={`nav-tab ${activeView === 'new-request' ? 'active' : ''}`}
          onClick={() => setActiveView('new-request')}
        >
          New Request
        </button>
        <button
          className={`nav-tab ${activeView === 'my-pass' ? 'active' : ''}`}
          onClick={() => setActiveView('my-pass')}
        >
          My Pass
        </button>
        <button
          className={`nav-tab ${activeView === 'my-bookings' ? 'active' : ''}`}
          onClick={() => setActiveView('my-bookings')}
        >
          My Bookings
        </button>
      </nav>

      <div className="page-container">
        {activeView === 'new-request' && <NewRequestView />}
        {activeView === 'my-pass' && <MyPassView />}
        {activeView === 'my-bookings' && <MyBookingsView />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// View 1: New Request
// ---------------------------------------------------------------------------
const NewRequestView = () => {
  // State
  const [step, setStep] = useState(1);
  const [source, setSource] = useState('');
  const [stop, setStop] = useState('');
  const [shift, setShift] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [journeyCompleted, setJourneyCompleted] = useState(false);

  // Calendar constants
  const startDay = 4; // October 2026 starts on Thursday (index 4)
  const totalDays = 31;

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (source && stop && shift) {
      setJourneyCompleted(true);
      setStep(2);
    } else {
      setJourneyCompleted(false);
      setStep(1);
    }
  }, [source, stop, shift]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleStepClick = (stepNumber) => {
    if (stepNumber > 1 && !journeyCompleted) {
      alert('Please complete the Journey Details first.');
      return;
    }
    setStep(stepNumber);
  };

  const toggleDate = (day) => {
    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const selectDays = (count) => {
    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      if (i <= count) days.push(i);
    }
    setSelectedDates(days);
    if (count > 0) setStep(3);
  };

  const selectBus = (busValue) => {
    setSelectedBus(busValue);
    setStep(4);
  };

  const submitForm = () => {
    if (!journeyCompleted) {
      alert('Please complete Journey Details.');
      return;
    }
    if (selectedDates.length === 0) {
      alert('Please select at least one travel date.');
      return;
    }
    if (!selectedBus) {
      alert('Please select a bus.');
      return;
    }
    alert(
      `Success! Bus Pass Request Submitted.\n\nDates: ${selectedDates.length} days\nBus: ${selectedBus}`
    );
  };

  // -------------------------------------------------------------------------
  // Calendar rendering
  // -------------------------------------------------------------------------
  const renderCalendar = () => {
    const days = [];
    // Empty cells for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day disabled" />);
    }
    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      const isSelected = selectedDates.includes(i);
      days.push(
        <div
          key={i}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => toggleDate(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="container">
      {/* Header */}
      <header className="page-header">
        <h1>New Bus Pass Request</h1>
        <p>Select your journey details below. Available buses update automatically.</p>
      </header>

      {/* Sidebar Navigation (Stepper) */}
      <aside className="sidebar">
        <ul className="stepper">
          {[
            { num: 1, title: 'Journey Details', desc: 'Where are you going' },
            { num: 2, title: 'Travel Dates', desc: 'Select booking dates' },
            { num: 3, title: 'Choose Bus', desc: 'Select available bus' },
            { num: 4, title: 'Submit', desc: 'Review & submit' },
          ].map((item) => (
            <li
              key={item.num}
              className={`step ${step === item.num ? 'active' : ''}`}
              onClick={() => handleStepClick(item.num)}
            >
              <div className="step-number">{item.num}</div>
              <div className="step-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Form Content */}
      <main className="form-area">
        <div className="info-banner">
          Booking for: <strong>Rahul Ramashankar Verma - 73000816</strong> (Information Technology)
        </div>

        {/* Card 1: Journey Details */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">📍</div>
            <div className="card-title">
              <h2>Journey Details</h2>
              <p>Choose where and when you travel.</p>
            </div>
          </div>

          <div className="input-grid">
            <div className="input-group">
              <label>
                Source <span className="required">*</span>
              </label>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="" disabled>
                  Select source
                </option>
                <option value="ghugus">Ghugus Plant</option>
                <option value="chandrapur">Chandrapur City</option>
              </select>
            </div>

            <div className="input-group">
              <label>
                Boarding Stop <span className="required">*</span>
              </label>
              <select value={stop} onChange={(e) => setStop(e.target.value)}>
                <option value="" disabled>
                  Select boarding stop
                </option>
                <option value="gate1">Gate No. 1</option>
                <option value="gate2">Gate No. 2</option>
              </select>
            </div>

            <div className="input-group">
              <label>
                Shift <span className="required">*</span>
              </label>
              <select value={shift} onChange={(e) => setShift(e.target.value)}>
                <option value="" disabled>
                  Select shift
                </option>
                <option value="a">Shift A (6:00 AM - 2:00 PM)</option>
                <option value="b">Shift B (2:00 PM - 10:00 PM)</option>
                <option value="c">Shift C (10:00 PM - 6:00 AM)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Weekly Off</label>
              <div className="locked-field">No weekly off selected</div>
              <p className="helper-text">Weekly-off dates are locked as holidays.</p>
            </div>
          </div>
        </div>

        {/* Card 2: Travel Dates */}
        <div className={`card ${!journeyCompleted ? 'disabled' : ''}`}>
          <div className="card-header">
            <div className="card-icon">📅</div>
            <div className="card-title">
              <h2>Travel Dates</h2>
              <p>Pick individual days or book the whole month.</p>
            </div>
          </div>

          <div className="calendar-controls">
            <div className="month-title">October 2026</div>
            <div className="calendar-actions">
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 12px', fontSize: '12px' }}
                onClick={() => selectDays(15)}
              >
                15 days
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 12px', fontSize: '12px' }}
                onClick={() => selectDays(30)}
              >
                30 days
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 12px', fontSize: '12px' }}
                onClick={() => selectDays(31)}
              >
                Select whole month
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            <div className="calendar-header">Sun</div>
            <div className="calendar-header">Mon</div>
            <div className="calendar-header">Tue</div>
            <div className="calendar-header">Wed</div>
            <div className="calendar-header">Thu</div>
            <div className="calendar-header">Fri</div>
            <div className="calendar-header">Sat</div>
            {renderCalendar()}
          </div>
          <p className={`helper-text ${selectedDates.length > 0 ? 'active' : ''}`}>
            {selectedDates.length === 0
              ? '0 travel days selected'
              : `${selectedDates.length} travel day${selectedDates.length > 1 ? 's' : ''} selected`}
          </p>
        </div>

        {/* Card 3: Choose an available bus */}
        <div className={`card ${!journeyCompleted ? 'disabled' : ''}`}>
          <div className="card-header">
            <div className="card-icon">🚌</div>
            <div className="card-title">
              <h2>Choose an available bus</h2>
              <p>Complete the journey details to see buses.</p>
            </div>
          </div>

          <div className="radio-card-group">
            {[
              { value: 'bus1', title: 'Bus 1 (MH-34-AB-1234)', desc: 'Departs: 06:00 AM' },
              { value: 'bus2', title: 'Bus 2 (MH-34-CD-5678)', desc: 'Departs: 06:15 AM' },
            ].map((bus) => (
              <label
                key={bus.value}
                className={`radio-card ${selectedBus === bus.value ? 'selected' : ''}`}
                onClick={() => selectBus(bus.value)}
              >
                <input
                  type="radio"
                  name="bus"
                  value={bus.value}
                  checked={selectedBus === bus.value}
                  readOnly
                />
                <div className="radio-card-content">
                  <h4>{bus.title}</h4>
                  <p>{bus.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <p className={`helper-text ${selectedBus ? 'active' : ''}`}>
            {selectedBus
              ? `Bus selected: ${selectedBus === 'bus1' ? 'Bus 1 (MH-34-AB-1234)' : 'Bus 2 (MH-34-CD-5678)'}`
              : 'Select source, boarding point, shift and dates to see available buses.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="form-footer">
          <button className="btn btn-secondary" onClick={() => alert('Draft saved successfully!')}>
            Save Draft
          </button>
          <button className="btn btn-primary" onClick={submitForm}>
            Submit Application →
          </button>
        </div>
      </main>
    </div>
  );
};

// ---------------------------------------------------------------------------
// View 2: My Pass
// ---------------------------------------------------------------------------
const MyPassView = () => {
  return (
    <div>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1>My Pass</h1>
      </div>

      <div className="pass-layout">
        {/* Bus Pass Card */}
        <div className="pass-card">
          <div className="pass-card-header">
            <div className="pass-logo">LLOYDS METALS</div>
            <div className="pass-location-icon">📍</div>
          </div>
          <h2>Employee Bus Pass</h2>
          <div className="pass-id">PASS-2026-93168500</div>

          <div className="pass-details-grid">
            <div className="pass-detail-item">
              <label>Employee</label>
              <span>Rahul Ramashanker Verma</span>
            </div>
            <div className="pass-detail-item">
              <label>Employee ID</label>
              <span>71008016</span>
            </div>
            <div className="pass-detail-item">
              <label>Department</label>
              <span>Information Technology</span>
            </div>
            <div className="pass-detail-item">
              <label>Route</label>
              <span>2 - Chandrapur</span>
            </div>
            <div className="pass-detail-item">
              <label>Bus</label>
              <span>BUS-03</span>
            </div>
            <div className="pass-detail-item">
              <label>Shift</label>
              <span>General Shift</span>
            </div>
            <div className="pass-detail-item">
              <label>Pickup</label>
              <span>Warora Naka</span>
            </div>
            <div className="pass-detail-item">
              <label>Destination</label>
              <span>Plant</span>
            </div>
          </div>

          <div className="pass-qr-area">
            <div className="pass-qr-placeholder">QR CODE</div>
            <div className="pass-qr-label">SCAN TO BOARD</div>
            <div className="pass-qr-encrypted">🔒 ENCRYPTED</div>
          </div>

          <div className="pass-footer">
            <div>
              Valid <strong>08 Oct 2026</strong> — <strong>11 Nov 2026</strong>
            </div>
            <button className="btn-outline-light" onClick={() => alert('QR Code sent to email!')}>
              ✉️ Send QR to Email
            </button>
          </div>
        </div>

        {/* Live Tracking Card */}
        <div className="tracking-card">
          <div className="tracking-header">
            <div className="tracking-label">
              <span>📡</span> LIVE TRACKING
            </div>
            <div className="tracking-badge">GPS integration pending</div>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#111' }}>
            Route map
          </h3>

          <div className="map-placeholder">
            <div className="map-route-line" />
            <div className="map-bus-icon">🚌</div>
            <div className="map-marker start">Warora Naka</div>
            <div className="map-marker end">Plant</div>
          </div>

          <p className="tracking-footer">
            Bus location will appear here when the fleet GPS feed is connected. Your pass and journey
            details remain live.
          </p>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// View 3: My Bookings
// ---------------------------------------------------------------------------
const MyBookingsView = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dates-dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const bookings = [
    {
      id: 'BP-2026-918260',
      route: '2',
      bus: 'BUS-03',
      shift: 'General Shift',
      dateCount: 30,
      status: 'approved',
      dates: [8, 9, 10, 12, 13, 14],
    },
    {
      id: 'BP-2026-462250',
      route: '5',
      bus: 'BUS-06',
      shift: 'General Shift',
      dateCount: 30,
      status: 'cancelled',
      dates: [8, 9],
    },
    {
      id: 'BP-2026-988716',
      route: '5',
      bus: 'BUS-06',
      shift: 'General Shift',
      dateCount: 30,
      status: 'rejected',
      testUser: true,
      dates: [8],
    },
    {
      id: 'BP-2026-132877',
      route: 'SHIFT-B',
      bus: 'BUS-01',
      shift: 'B Shift',
      dateCount: 14,
      status: 'cancelled',
      dates: [8],
    },
    {
      id: 'BP-2026-919759',
      route: '5',
      bus: 'BUS-06',
      shift: 'General Shift',
      dateCount: 15,
      status: 'cancelled',
      dates: [8],
    },
    {
      id: 'BP-2026-850304',
      route: '2',
      bus: 'BUS-02',
      shift: 'General Shift',
      dateCount: 15,
      status: 'rejected',
      testUser: true,
      dates: [8],
    },
    {
      id: 'BP-2026-908307',
      route: 'SHIFT-A',
      bus: 'BUS-01',
      shift: 'A Shift',
      dateCount: 30,
      status: 'cancelled',
      dates: [8],
    },
    {
      id: 'BP-2026-131663',
      route: 'SHIFT-A',
      bus: 'BUS-01',
      shift: 'A Shift',
      dateCount: 30,
      status: 'cancelled',
      dates: [8],
    },
    {
      id: 'BP-2026-937197',
      route: 'SHIFT-A',
      bus: 'BUS-01',
      shift: 'A Shift',
      dateCount: 14,
      status: 'cancelled',
      dates: [8],
    },
    {
      id: 'BP-2026-718495',
      route: '5',
      bus: 'BUS-06',
      shift: 'General Shift',
      dateCount: 15,
      status: 'cancelled',
      dates: [8],
    },
    {
      id: 'BP-2026-773092',
      route: '5',
      bus: 'BUS-06',
      shift: 'General Shift',
      dateCount: 15,
      status: 'cancelled',
      dates: [8],
    },
    {
      id: 'BP-2026-998150',
      route: '5',
      bus: 'BUS-06',
      shift: 'General Shift',
      dateCount: 15,
      status: 'cancelled',
      dates: [8],
    },
  ];

  const getStatusBadge = (status, testUser) => {
    const badges = {
      approved: <span className="status-badge approved">✓ Approved</span>,
      cancelled: <span className="status-badge cancelled">⊘ Cancelled</span>,
      rejected: (
        <span className="status-badge rejected">
          ✕ Rejected {testUser && <span className="test-user-tag">test user</span>}
        </span>
      ),
    };
    return badges[status] || null;
  };

  // Format date for display
  const formatDate = (day) => {
    return `${day.toString().padStart(2, '0')} Oct 2026`;
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1>My Bookings</h1>
      </div>

      <div className="bookings-card">
        {/* Filters */}
        <div className="bookings-filters">
          <select className="filter-select">
            <option>All statuses</option>
            <option>Approved</option>
            <option>Cancelled</option>
            <option>Rejected</option>
          </select>
          <select className="filter-select">
            <option>All routes</option>
            <option>Route 2</option>
            <option>Route 5</option>
          </select>
          <select className="filter-select">
            <option>All Buses</option>
            <option>BUS-01</option>
            <option>BUS-02</option>
            <option>BUS-03</option>
            <option>BUS-06</option>
          </select>
          <input type="date" className="filter-date" defaultValue="2026-10-09" />
        </div>

        {/* Table */}
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Route</th>
              <th>Bus</th>
              <th>Shift</th>
              <th>Booking dates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.route}</td>
                <td>{booking.bus}</td>
                <td>{booking.shift}</td>
                <td>
                  <div className="dates-dropdown-container">
                    <div
                      className="dates-dropdown-toggle"
                      onClick={() => toggleDropdown(booking.id)}
                    >
                      <span>{booking.dateCount} dates</span>
                    </div>
                    <div
                      className={`dates-dropdown-menu ${
                        openDropdown === booking.id ? 'open' : ''
                      }`}
                    >
                      <div className="dates-dropdown-header">
                        <span>{booking.dateCount} Dates</span>
                        <button
                          className="btn-select-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            const menu = e.target.closest('.dates-dropdown-menu');
                            const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
                            const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
                            checkboxes.forEach((cb) => (cb.checked = !allChecked));
                            e.target.textContent = allChecked ? 'Select all' : 'Deselect all';
                          }}
                        >
                          Select all
                        </button>
                      </div>
                      {booking.dates.map((day) => (
                        <div key={day} className="date-item">
                          <div className="date-item-left">
                            <input type="checkbox" defaultChecked />
                            <label>{formatDate(day)}</label>
                          </div>
                          <span className="badge-booked">Booked</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(booking.status, booking.testUser)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusPassSystem;