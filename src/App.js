
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './module/Home';
import SignIn from './module/SignIn';
import SignUp from './module/SignUp';
import Profile from './module/Profile';
import Header from './components/Header';

import PrivateRoute from './components/PrivateRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>

          <Route path='/profile' element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile/>}/>
          </Route>
          
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
    </>
  );
}

export default App;
