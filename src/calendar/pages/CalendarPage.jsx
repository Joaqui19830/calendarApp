import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useEffect, useState } from "react";
import {
  CalendarEvent,
  CalendarModal,
  FabAddNew,
  FabDelete,
  NavBar,
} from "../";
import { getMessagesEs, localizer } from "../../helpers";
import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks";

// const events = [
//   {
//     title: "Cumpleaños del Jefe",
//     notes: "Hay que comprar el pastel",
//     start: new Date(),
//     end: addHours(new Date(), 2),
//     bgColor: "#fafafa",
//     user: {
//       _id: "123",
//       name: "Joaquin",
//     },
//   },
// ];

export const CalendarPage = () => {
  const { user } = useAuthStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

  const { openDateModal } = useUiStore();

  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  );

  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log({event, start, end, isSelected});
    // console.log(event);
    const isMyEvent =
      user.uid === event.user._id || user.uid === event.user.uid;
    const style = {
      backgroundColor: isMyEvent ? "#347CF7" : "#465660",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
    };

    return {
      style,
    };
  };

  const onDoubleClick = (event) => {
    // console.log({ doubleClick: event });
    openDateModal();
  };

  const onSelect = (event) => {
    // console.log({ click: event });
    setActiveEvent(event);
  };

  const onViewChange = (event) => {
    // console.log({ viewChange: event });
    localStorage.setItem("lastView", event);
    setLastView(event);
  };

  // Mandamos el arreglo de dependencias vacios porque solo quiero dispararlo una vez
  useEffect(() => {
    startLoadingEvents();
  }, []);

  return (
    <>
      <NavBar />

      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }}
        messages={getMessagesEs()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChange}
      />

      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  );
};
