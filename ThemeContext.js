// ThemeContext.js para hacer los cambios de temas 
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}