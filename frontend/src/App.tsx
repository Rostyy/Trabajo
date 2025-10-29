import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Panel from './views/Panel';
import RutaPrivada from './components/RutaPrivada';
import { AuthProvider } from './context/AuthContext';
//import './index.css';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/panel" element={
            <RutaPrivada>
              <Panel />
            </RutaPrivada>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

