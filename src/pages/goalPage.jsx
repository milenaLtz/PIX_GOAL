import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import Header from '../widgets/header';
import IntroductionBlock from '../widgets/introductionBlock';
import PixiCanvas from '../PixiCanvas';
import UserGoalsBlock from '../widgets/userGoalsBlock';
import GoalTasksBlock from '../entities/goalTasksBlock';
import Footer from '../widgets/footer';
import PixelInfoBlock from '../widgets/pixelInfoBlock';
import cake from '../shared/icons/illustration/cake.svg';
import cat from '../shared/icons/illustration/cat.svg';
import car from '../shared/icons/illustration/car.svg';
import rabbit from '../shared/icons/illustration/rabbit.svg';
import heart from '../shared/icons/illustration/heart.svg';

const GoalPage = () => {
  const {id} = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState(null);
  const canvasRef = useRef(null);


  const handleOpenModal = (pixel) => {
    setSelectedPixel(pixel);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPixel(null);
    window.location.reload();
  };

  const handleAddPixel = (pixelCount) => {
    if (canvasRef.current) {
      for (let i = 0; i < pixelCount; i++) {
        canvasRef.current.addPixel();
      }
    }
  };

  // const changePixelColor = (event) => {
  //   setSelectedColor(event.target.value);
  //   if (!selectedPixel) return;

  //   const app = appRef.current;
  //   const updatedPixels = pixels.map(pixel =>
  //     pixel.id === selectedPixel ? { ...pixel, color: event.target.value } : pixel
  //   );}

  const handleUpdatePixelColor = (pixelId, newColor) => {
    if (canvasRef.current) {
      canvasRef.current.updatePixelColor(pixelId, newColor);
    }
  };

  const goals = [
    { id: 1, title: "Научиться выпекать", freePixels: 387, image: cake, description: "Описание цели" },
    { id: 2, title: "Получить кошку", freePixels: 500, image: cat, description: "Описание цели" },
    { id: 3, title: "Покупка автомобиля", freePixels: 150, image: car, description: "Описание цели" },
    { id: 4, title: "Путешествие", freePixels: 700, image: rabbit, description: "Описание цели" },
    { id: 5, title: "Здоровое сердце", freePixels: 120, image: heart, description: "Описание цели" },
];

  const goal = goals.find(g => g.id === parseInt(id));
  console.log(goal)// Ищем цель по id

  if (goal) {
      return <div>Цель не найдена</div>;
  }

  return(
      <>
        <Header/>
        <div className='main-page__wrapper'>
        <main className='main-page'>
          <IntroductionBlock page="goal" greetings="Научиться выпекать" description="Подробная информация о цели"/>
          <PixiCanvas
          onOpenModal={handleOpenModal}
          onCloseModal={handleCloseModal}
          // onUpdatePixelColor={changePixelColor}
          ref={canvasRef}
          // selectedPixel={selectedPixel}
          />
          <GoalTasksBlock onAddPixel={handleAddPixel}/>
          <UserGoalsBlock/>
        </main>
          {showModal && (
            <PixelInfoBlock
            selectedPixel={selectedPixel}
            closeModal={handleCloseModal}
            onUpdatePixelColor={handleUpdatePixelColor}
            />
          )}
        </div>
        <Footer/>
      </>
  )
}
export default GoalPage;
