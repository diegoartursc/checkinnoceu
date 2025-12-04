import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
};

export const NavigationProvider = ({ children }) => {
    const [screen, setScreen] = useState('checkin'); // checkin, map, lar, settings
    const lastNavigateTime = useRef(0);

    const navigate = useCallback((screenName) => {
        const now = Date.now();
        if (now - lastNavigateTime.current < 300) {
            return;
        }
        lastNavigateTime.current = now;
        setScreen(screenName);
    }, []);

    return (
        <NavigationContext.Provider value={{ screen, navigate }}>
            {children}
        </NavigationContext.Provider>
    );
};
