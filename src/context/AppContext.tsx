import React, { createContext, useState } from 'react';

export const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: any) => {

  const [state, setState] = useState({
    dailyQuests: [
      {
        id: 1,
        title: '10 XP kazan',
        progress: 4,
        goal: 10
      },
      {
        id: 2,
        title: '1 ders tamamla',
        progress: 0,
        goal: 1
      }
    ]
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};