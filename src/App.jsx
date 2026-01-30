import { Route,BrowserRouter as Router, Routes } from 'react-router'
import './App.css'
import SignUp from './component/sign-up'
import Dashboard from './component/dashboard';
import { ExpenseProvider } from './store/expense-tracker-context';
import Login from './component/login';
import ProtectedRoute from './component/protected-routes';
import Profile from './component/profile';

function App() {

  return (
    <ExpenseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ExpenseProvider>
  );
}

export default App
