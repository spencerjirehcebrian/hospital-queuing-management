import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './module/Home';
import SignIn from './module/SignIn';
import SignUp from './module/SignUp';
import Profile from './module/Profile';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
