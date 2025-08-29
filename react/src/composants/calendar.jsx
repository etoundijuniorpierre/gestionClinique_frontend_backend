// Calendrier.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #f2f2f2;
  padding: 30px 20px;
`;

const Content = styled.div`
  flex: 1;
  background: #f9f9ff;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CalendarWrapper = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

export default function Calendrier() {
  const events=[
    { title: 'All Day Event', start: '2021-03-01' },
    { title: 'Conference', start: '2021-03-02' },
    { title: '10:30a Meeting', start: '2021-03-03T10:30:00' },
    { title: '12p Lunch', start: '2021-03-03T12:00:00' },
    { title: 'Birthday Party', start: '2025-08-04T10:30:00' },
    { title: 'Long Event', start: '2025-08-05', end: '2025-08-07' },
    { title: 'Repeating Event', start: '2021-03-09T16:00:00' },
    { title: 'Click for Google', url: 'http://google.com/', start: '2021-03-28' }
  ]

  return (
    <Wrapper>
      <Sidebar>
        <h2>Clinique d'Afrik</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>🧑‍⚕️ Utilisateurs</li>
          <li>🩺 Consultations</li>

          <li style={{ fontWeight: 'bold', color: '#3b82f6' }}>📅 Calendrier</li>
        </ul>
      </Sidebar>

      <Content>
        <Header>
          <div>
            <h2>Calendrier</h2>
            <p>Liste des événements</p>
          </div>
          <div>
            <span>⏰ Événement imminent : </span>
            <strong> Demain • 13h40 • Opération du cœur Temgoua</strong>
          </div>
        </Header>

        <CalendarWrapper>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev today next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            events={events}
            height="auto"
            eventColor="#6366f1"
          />
        </CalendarWrapper>
      </Content>
    </Wrapper>
  );
}
