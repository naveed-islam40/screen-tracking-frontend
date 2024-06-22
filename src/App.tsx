
import Signup from './components/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import Login from './components/Login';
import EmployeeSignup from './components/EmployeeSignup';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeLandingPage from './components/EmployeeDashboard';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/login/employee' element={<EmployeeLogin />} />
          <Route path='/dashboard/admin' element={ <Dashboard />} />
          <Route path='/create-employee' element={ <EmployeeSignup />} />
          <Route path='/dashboard/employee' element={<EmployeeLandingPage />} />
        </Routes>
       
      </BrowserRouter>
    </div>
  )
}

export default App;