import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  openMarinaModal: (initialPrompt?: string) => void;
  isMarinaModalOpen: boolean;
  closeMarinaModal: () => void;
  marinaInitialPrompt: string;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: window.location.pathname || '/',
  navigate: () => {},
  openMarinaModal: () => {},
  isMarinaModalOpen: false,
  closeMarinaModal: () => {},
  marinaInitialPrompt: '',
});

export const useRouter = () => useContext(RouterContext);

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname || '/'
  );
  const [isMarinaModalOpen, setIsMarinaModalOpen] = useState<boolean>(false);
  const [marinaInitialPrompt, setMarinaInitialPrompt] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openMarinaModal = (initialPrompt?: string) => {
    if (initialPrompt) {
      setMarinaInitialPrompt(initialPrompt);
    }
    setIsMarinaModalOpen(true);
  };

  const closeMarinaModal = () => {
    setIsMarinaModalOpen(false);
    setMarinaInitialPrompt('');
  };

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        navigate,
        openMarinaModal,
        isMarinaModalOpen,
        closeMarinaModal,
        marinaInitialPrompt,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
