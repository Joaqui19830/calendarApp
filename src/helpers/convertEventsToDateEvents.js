import { parseISO } from "date-fns";


export const convertEventsToDateEvents = (events = []) => {

    return events.map(event => {

        // Convertimos la data que viene como string a number
        event.start = parseISO(event.start);
        event.end = parseISO(event.end);

        return event;
    })

}
