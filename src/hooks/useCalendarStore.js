import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store/calendar/calendarSlice';

export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth)

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async (calendarEvent) => {
        try {
            // llegar al backend
            // Update event
            if (calendarEvent.id) {
                //Actualizando
                // Llamamos el endpoint y despues la data que tenemos que grabar
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            //Creando
            // Ya por interceptores ya trae el token entonces solo tengo que llamar el '/events' y la info del back
            const { data } = await calendarApi.post('/events', calendarEvent);
            // console.log({ data });
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));

        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.mgs, 'error');
        }

    }

    const startDeletingEvent = async () => {
        // Llegar al backend
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`)
            dispatch(onDeleteEvent());

        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.mgs, 'error');
        }
    }

    const startLoadingEvents = async () => {
        try {

            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.eventos);
            dispatch(onLoadEvents(events));

        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        //*Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent, // Si es null regresa falso, si tiene un obj va a regresar true

        //*Metodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents
    }


}
