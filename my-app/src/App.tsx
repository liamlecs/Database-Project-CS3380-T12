import { useState } from 'react'
import FrontPage from "./components/FrontPage";
import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} /> 
      </Routes>
    </Router>
  )
}

export default App
