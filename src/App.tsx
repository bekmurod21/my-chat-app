import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginRegisterPage from './pages/LoginRegisterPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRegisterPage/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
        <Route path="*" element={<LoginRegisterPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
