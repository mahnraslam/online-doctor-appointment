import { createContext,useState } from "react";

const AppointmentContext = createContext() ; 


const  AppointmentProvider = ({ children }) => {
    
const [appointments, setAppointments] = useState([]);
  return (
    <AppointmentContext.Provider value={{ appointments, setAppointments }}>
        {children}
    </AppointmentContext.Provider>
    );
};
export default AppointmentContext;