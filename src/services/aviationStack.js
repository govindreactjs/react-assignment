// import axios from "axios";

// const API_URL = "https://api.aviationstack.com/v1/flights";

// const normalizeFlight = (item, index, leg) => {
//   const departure = item.departure || {};
//   const arrival = item.arrival || {};
//   const airline = item.airline || {};
//   const flight = item.flight || {};

//   const departureTime = departure.scheduled
//     ? new Date(departure.scheduled).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
//     : "08:00";

//   const arrivalTime = arrival.scheduled
//     ? new Date(arrival.scheduled).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
//     : "10:00";

//   const stops = Number.isFinite(item.stops) ? item.stops : 0;

//   return {
//     id: `${flight.iata || flight.number || "API"}-${index}-${leg.from}-${leg.to}`,
//     flightNumber: flight.iata || flight.number || "N/A",
//     airline: airline.name || "Unknown Airline",
//     from: departure.iata || leg.from,
//     to: arrival.iata || leg.to,
//     departureTime,
//     arrivalTime,
//     date: leg.date,
//     price: Math.max(1500, 2500 + index * 850),
//     totalSeats: 180,
//     bookedSeats: 0,
//     stops
//   };
// };

// export const searchFlights = async (legs) => {
//   const accessKey = import.meta.env.VITE_AVIATIONSTACK_KEY;

//   if (!accessKey) {
//     throw new Error("AviationStack API key is missing. Add VITE_AVIATIONSTACK_KEY to .env.");
//   }

//   const responses = await Promise.all(
//     legs.map(async (leg) => {
//       const response = await axios.get(API_URL, {
//         params: {
//           access_key: accessKey,
//           dep_iata: leg.from,
//           arr_iata: leg.to,
//           flight_date: leg.date,
//           limit: 25
//         }
//       });

//       return (response.data?.data || []).map((item, index) =>
//         normalizeFlight(item, index, leg)
//       );
//     })
//   );

//   return responses.flat();
// };


import axios from "axios";

const API_URL = "https://api.aviationstack.com/v1/flights";

const normalizeFlight = (item, index, leg) => {
  const departure = item.departure || {};
  const arrival = item.arrival || {};
  const airline = item.airline || {};
  const flight = item.flight || {};

  const departureTime = departure.scheduled
    ? new Date(departure.scheduled).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "N/A";

  const arrivalTime = arrival.scheduled
    ? new Date(arrival.scheduled).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "N/A";

  return {
    id: `${flight.iata || flight.number || "API"}-${index}-${leg.from}-${leg.to}`,

    flightNumber: flight.iata || flight.number || "N/A",

    airline: airline.name || "Unknown Airline",

    from: departure.iata || leg.from,

    to: arrival.iata || leg.to,

    departureTime,

    arrivalTime,

    date: leg.date,

    // AviationStack does not provide ticket price
    // so this is mock data for your assignment UI.
    price: 2500 + index * 850,

    // Mock seat information
    totalSeats: 180,
    bookedSeats: 0,

    // Direct flight by default.
    // AviationStack response doesn't normally give
    // a simple top-level "stops" property.
    stops: 0,

    status: item.flight_status || "scheduled",

    aircraft: item.aircraft?.registration || "N/A",
  };
};

export const searchFlights = async (legs) => {
  const accessKey = import.meta.env.VITE_AVIATIONSTACK_KEY;

  if (!accessKey) {
    throw new Error(
      "AviationStack API key is missing. Add VITE_AVIATIONSTACK_KEY to .env"
    );
  }

  try {
    const responses = await Promise.all(
      legs.map(async (leg) => {
        const response = await axios.get(API_URL, {
          params: {
            access_key: accessKey,
            dep_iata: leg.from,
            arr_iata: leg.to,
            limit: 25,
          },
        });

        return (response.data?.data || []).map((item, index) =>
          normalizeFlight(item, index, leg)
        );
      })
    );

    return responses.flat();
  } catch (error) {
    console.error("AviationStack API Error:", error);

    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to fetch flights";

    throw new Error(message);
  }
};