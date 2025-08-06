
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import QuizCreator from './components/QuizCreator';
import QuizTaker from './components/QuizTaker';
import QuizResult from './components/QuizResult';
import Login from './components/Login';

// Mock Users
const users: Record<UserRole, User> = {
  student: { id: 'student123', name: 'শিক্ষার্থী', role: 'student' },
  teacher: { id: 'teacher456', name: 'শিক্ষক', role: 'teacher' },
  admin: { id: 'admin789', name: 'অ্যাডমিন', role: 'admin' },
};

// --- Context for Auth and Navigation ---
interface AppContextType {
  currentUser: User | null;
  logout: () => void;
  navigate: (path: string) => void;
  route: string;
}

const AppContext = createContext<AppContextType | null>(null);
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};

// --- Main App Component ---
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const navigate = (path: string) => {
      window.location.hash = path;
  };
  
  const login = (role: UserRole) => {
    setCurrentUser(users[role]);
    navigate('/dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  }

  const renderContent = () => {
    if (!currentUser) return null;

    const path = route.substring(1);
    
    // Teacher Routes
    if (currentUser.role === 'teacher') {
        if(path === '/teacher/create-quiz') return <QuizCreator />;
    }
    
    // Student Routes
    if(currentUser.role === 'student'){
        if (path.startsWith('/quiz/take/')) {
            const quizId = path.split('/')[3];
            return <QuizTaker quizId={quizId} />;
        }
        if (path.startsWith('/quiz/result/')) {
            const score = parseInt(path.split('/')[3] || '0');
            const total = parseInt(path.split('/')[4] || '0');
            return <QuizResult score={score} total={total} />;
        }
    }
    
    switch (path) {
      case '/':
      case '/dashboard':
        return <Dashboard />;
      default:
        // Prevent access to other roles' pages
        if ( (currentUser.role !== 'teacher' && path.startsWith('/teacher')) || 
             (currentUser.role !== 'admin' && path.startsWith('/admin'))) {
            return <div className="p-8 text-center text-xl">আপনার এই পেইজে প্রবেশ করার অনুমতি নেই।</div>;
        }
        return <div className="p-8 text-center text-xl">পেজ পাওয়া যায়নি (404 Not Found)</div>;
    }
  };

  if (!currentUser) {
    return <Login onLogin={login} />;
  }

  return (
    <AppContext.Provider value={{ currentUser, logout, navigate, route }}>
      <div className="flex h-screen bg-slate-100 font-sans">
        <Sidebar userRole={currentUser.role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8">
            {renderContent()}
          </main>
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
