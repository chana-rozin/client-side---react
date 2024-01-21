import './App.css'
import LogIn from './Components/LogIn/LogIn'
import Home from './Components/Home/Home'
import Register from './Components/Register/Register'
import Todos from './Components/Todos/Todos'
import Albums from './Components/Albums/Albums'
import Posts from './Components/Posts/Posts'
import Comments from './Components/Comments/Comments'
import Info from './Components/Info/Info'
import { React, createContext, useState } from 'react'
import { ReactDOM } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useParams } from 'react-router-dom'
export const userContext = createContext()

function App() {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  fetch("http://localhost:3000/users/2")
    .then(re => re.json())
    .then(r => console.log(r));

  return (
    <>
      <userContext.Provider value={{ currentUser, setCurrentUser }}>
        <Router>
          <Routes>
            <Route path='/' element={<Navigate to={currentUser != null ? "/home" : "/login"} />} />
            <Route path='/login' element={<LogIn />} />
            <Route path='/home' element={currentUser != null ? <Home /> : <LogIn />} />
            <Route path='/register' element={<Register />} />
            <Route path='/users/:userId'>
              <Route path='info' element={currentUser != null ? <Info/> : <LogIn />}></Route>
              <Route path='todos' element={currentUser != null ? <Todos /> : <LogIn />} />
              <Route path='albums' element={currentUser != null ? <Albums /> : <LogIn />} />
              <Route path='posts' element={currentUser != null ? <Posts /> : <LogIn />} >
                <Route path=':postId/comments' element={<Comments />} />
              </Route>
            </Route>

            <Route path='*' element={<div><h2>404 Page not found</h2></div>} />
          </Routes>
        </Router>
      </userContext.Provider>
    </>
  )
}

export default App
