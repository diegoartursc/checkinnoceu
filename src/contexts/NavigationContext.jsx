import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
};

export const NavigationProvider = ({ children }) => {
    const [screen, setScreen] = useState('checkin'); // checkin, map, lar

    const navigate = (screenName) => {
        setScreen(screenName);
    };

    return (
        <NavigationContext.Provider value={{ screen, navigate }}>
            {children}
        </NavigationContext.Provider>
    );
};
