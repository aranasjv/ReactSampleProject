import './App.css';
import { Home } from './Home';
import { Department } from './Department';
import { Employee } from './Employee';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <h3 className='d-flex justify-content-center m-3'>
          React Test
        </h3>

        <nav className='navbar navbar-expand-sm bg-light navbar-dark justify-content-center'>
          <ul className='navbar-nav'>
            <li className='nav-item m-1'>
              <NavLink className="btn btn-light btn-outline-primary" to="/home">
                Home
              </NavLink>
            </li>
            <li className='nav-item m-1'>
              <NavLink className="btn btn-light btn-outline-primary" to="/department">
                Department
              </NavLink>
            </li>
            <li className='nav-item m-1'>
              <NavLink className="btn btn-light btn-outline-primary" to="/employee">
                Employee
              </NavLink>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/department" element={<Department />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="*" element={<h4>404 - Not Found</h4>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
