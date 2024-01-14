import './App.css'
import LogIn from './Components/LogIn/LogIn'
import Home from './Components/Home/Home'
import Register from './Components/Register/Register'
import { React, createContext, useState } from 'react'
import { ReactDOM } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom'

export const userContext = createContext()

function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser"));
  fetch("http://localhost:3000/users?username=Bret&website=hildegard.org").then(re => re.json()).then(r => console.log(r))
  // fetch('https://localhost:3000/users', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     "id": 12,
  //     "name": "Leanne Graham1",
  //     "username": "Bret",
  //     "email": "Sincere@april.biz",
  //     "address": {
  //       "street": "Kulas Light",
  //       "suite": "Apt. 556",
  //       "city": "Gwenborough",
  //       "zipcode": "92998-3874",
  //       "geo": {
  //         "lat": "-37.3159",
  //         "lng": "81.1496"
  //       }
  //     },
  //     "phone": "1-770-736-8031 x56442",
  //     "website": "hildegard.org",
  //     "company": {
  //       "name": "Romaguera-Crona",
  //       "catchPhrase": "Multi-layered client-server neural-net",
  //       "bs": "harness real-time e-markets"
  //     }
  //   }),
  //   headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //   })
  //   .then((response) => response.json())
  //   .then((json) => console.log(json));
  return (
    <>
      <userContext.Provider value={{ currentUser, setCurrentUser }}>
       <Router>
        <Routes>
          <Route path='/' element={<Navigate to={currentUser!=null?"/home":"/login"}/>}/>
          <Route path='/login' element={<LogIn/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='*' element={<div><h2>404 Page not found</h2></div>}/>
        </Routes>
       </Router>
      </userContext.Provider>
    </>
  )
}

export default App
