import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import FrontPage from './components/FrontPage.tsx';

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
