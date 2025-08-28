import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import MealPage from './pages/MealPage';
import WorkoutPage from './pages/WorkoutPage';

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* ナビゲーション */}
        <Navigation />
        
        {/* メインコンテンツ */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meals" element={<MealPage />} />
          <Route path="/workouts" element={<WorkoutPage />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
