import logo from './logo.svg';
import './App.scss';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PixelGrid from './PixelGrid'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PixiCanvas from './PixiCanvas';
import HomePage from './pages/homePage';
import GoalPage from './pages/goalPage';

function App() {

  const goals = [
    { id: 1, title: "Научиться выпекать", freePixels: 387, image: "cake" },
    { id: 2, title: "Получить кошку", freePixels: 500, image: "cat" },
    { id: 3, title: "Покупка автомобиля", freePixels: 150, image: "car" },
    { id: 4, title: "Путешествие", freePixels: 700, image: "rabbit" },
    { id: 5, title: "Здоровое сердце", freePixels: 120, image: "heart" },
  ];

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/homePage' element={<HomePage/>}/>
        <Route path='/goalPage/1' element={<GoalPage/>}/>
        <Route path="/goalPage/:id" component={<GoalPage/>} />
      </Routes>
    </Router>
      {/* <PixiCanvas/> */}
      {/* <DndProvider backend={HTML5Backend}>
        <PixelGrid gridSize={20}/>
      </DndProvider> */}
    </>
  );
}

export default App;
