// netraidcontext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the context
const NetraIDContext = createContext();

// Create a custom hook to access the context value
export const useNetraID = () => useContext(NetraIDContext);

// Create the provider component
export const NetraIDProvider = ({ children }) => {
  const [netraID, setNetraID] = useState(null);

  return (
    <NetraIDContext.Provider value={{ netraID, setNetraID }}>
      {children}
    </NetraIDContext.Provider>
  );
};
