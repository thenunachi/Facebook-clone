import React, { createContext, useContext, useState } from "react";
const ThemeContext = createContext();

const lightTheme = {
  body: "#FFFFFF",
  text: "#333333",
  border: "1px solid grey"
  // Add more CSS properties as needed
};

const darkTheme = {
  body: "#333333",
  text: "#FFFFFF",
 
  // Add more CSS properties as needed
};


export const useTheme = () => {
  return useContext(ThemeContext);
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}