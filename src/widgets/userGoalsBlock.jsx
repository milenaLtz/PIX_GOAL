import GoalCard from "../entities/goalCard";
import cake from '../shared/icons/illustration/cake.svg';
import cat from '../shared/icons/illustration/cat.svg';
import car from '../shared/icons/illustration/car.svg';
import rabbit from '../shared/icons/illustration/rabbit.svg';
import heart from '../shared/icons/illustration/heart.svg';
import { useState, useEffect } from "react";


const UserGoalsBlock = () => {

    const [goals, setGoals] = useState([]);
    useEffect(() => {
      fetch('http://80.90.189.80:8080/PixelBackendScripted/api/tasks/4')
          .then((response) => response.json())
          .then((data) => setGoals(data))
          .catch((error) => console.error('Error fetching users:', error));
    }, []);

    console.log(goals)

    const GOALS = [
      {
        id: 1,
        title: "Научиться выпекать",
        freePixels: 387,
        image: cake,
        description: "Развить навык выпекания тортов и пирогов.",
        progress: "50%",
        date: "2024-12-01",
        deletionResult: "success",
      },
      {
        id: 2,
        title: "Получить кошку",
        freePixels: 500,
        image: cat,
        description: "Завести домашнего питомца, ухаживать за ним.",
        progress: "20%",
        date: "2024-11-15",
        deletionResult: "fail",
      },
      {
        id: 3,
        title: "Покупка автомобиля",
        freePixels: 150,
        image: car,
        description: "Накопить деньги на покупку нового автомобиля.",
        progress: "80%",
        date: "2024-08-10",
        deletionResult: "success",
      },
      {
        id: 4,
        title: "Путешествие",
        freePixels: 700,
        image: rabbit,
        description: "Посетить несколько стран и открыть для себя новые культуры.",
        progress: "30%",
        date: "2024-09-05",
        deletionResult: "success",
      },
      {
        id: 5,
        title: "Здоровое сердце",
        freePixels: 120,
        image: heart,
        description: "Заняться спортом и следить за своим здоровьем.",
        progress: "60%",
        date: "2024-10-01",
        deletionResult: "success",
      },
    ];

    return(
        <>
          <section className="main-page__block block goals-block">
            <div className="goals-block__wrapper">
              <div className="goals-block__intro">
                <h2 className="goals-block__title">Цели на данный момент</h2>
                {/* <div className="goals-block__button-wrapper">
                  <button className="goals-block__button button"></button>
                  <button className="goals-block__button button"></button>
                </div> */}
              </div>
              <div className="goals-block__cards-wrapper">
                {GOALS.map(goal => {
                  return(
                    <GoalCard key={goal.id} id={goal.id} title={goal.title} freePixels={goal.freePixels} image={goal.image} deletionResult={goal.deletionResult}/>
                  )
                })}
                {/* <GoalCard title="Научиться выпекать" freePixels="387" image={cake}/> */}
              </div>
              <div className="goals-block__button-wrapper goals-block__button-wrapper--footer">
                <button className="goals-block__button goals-block__button--text button">Посмотреть все цели</button>
                <button className="goals-block__button goals-block__button--text button">+</button>
              </div>
            </div>
          </section>
        </>
    )
}
export default UserGoalsBlock;
