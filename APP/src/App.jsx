import './App.css'
import Login from './Components/Login/Login'
import Home from './Components/Home/Home'
import Register from './Components/Register/Register'
import Todos from './Components/Todos/Todos'
import Albums from './Components/Albums/Albums'
import Posts from './Components/Posts/Posts'
import Comments from './Components/Comments/Comments'
import Info from './Components/Info/Info'
import Photos from './Components/Photos/Photos'
import Layout from './Components/Layout/Layout'
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'
import { React, createContext, useEffect, useState } from 'react'
import { ReactDOM } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useParams, renderMatches } from 'react-router-dom'
import PostDetails from './Components/Posts/PostDetails'
export const userContext = createContext()
export const cacheContext = createContext()

function App() {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  useEffect(() => {
    localStorage.getItem("frequencies") ??
    localStorage.setItem("frequencies", JSON.stringify({ first: "", second: "", third: "" }))}, []);

  function cacheGet(dataName) {
    const data = JSON.parse(localStorage.getItem(dataName));
    if (data != null && data.user == currentUser.id) {
      updateCacheFrequencies(dataName);
      return data.data;
    }
    else return [];
  }

  function updateCacheFrequencies(recentUse) {
    const cacheFrequencies = JSON.parse(localStorage.getItem("frequencies"));
    switch(recentUse){
      case cacheFrequencies.first:{
        break;
      }case cacheFrequencies.second:{
        cacheFrequencies.second = cacheFrequencies.first;
        cacheFrequencies.first = recentUse;
        break;
      }case cacheFrequencies.third:{
        cacheFrequencies.third = cacheFrequencies.second;
        cacheFrequencies.second = cacheFrequencies.first;
        cacheFrequencies.first = recentUse;
        break;
      }default:{
        localStorage.removeItem(cacheFrequencies.third);
        cacheFrequencies.third = cacheFrequencies.second;
        cacheFrequencies.second = cacheFrequencies.first;
        cacheFrequencies.first = recentUse;
      }
    }
    localStorage.setItem("frequencies", JSON.stringify(cacheFrequencies));
  }

  return (
    <>
      <cacheContext.Provider value={{ cacheGet, updateCacheFrequencies }}>
        <userContext.Provider value={{ currentUser, setCurrentUser }}>
          <Router>
            <Routes>
              <Route path='/' element={<Navigate to={currentUser != null ? "/home" : "/Login"} />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path='/home' element={<Home />} />
                  <Route path='/users/:userId'>
                    <Route path='info' element={<Info />}></Route>
                    <Route path='todos' element={<Todos />} />
                    <Route path='albums'>
                      <Route index element={<Albums />} />
                      <Route path=':albumId/photos' element={<Photos />} />
                    </Route>
                    <Route path='posts' element={<Posts />} >
                      <Route path=':postId' />
                      <Route path=':postId/comments' element={<Comments />} />
                    </Route>
                  </Route>
                </Route>
              </Route>
              <Route path='*' element={<div><h2>404 Page not found</h2></div>} />
            </Routes>
          </Router>
        </userContext.Provider>
      </cacheContext.Provider>
    </>
  )
}

export default App;
