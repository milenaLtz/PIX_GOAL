import { Link } from "react-router-dom";
import { useState } from "react";
import { DeleteModal, InfoModal } from "../widgets/modals";
import { createPortal } from "react-dom";

const GoalCard = (props) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
    console.log("deleteMode", deleteModalOpen);
  };

  const handleDeleteGoal = () => {
    setDeleteModalOpen(false);
    setInfoModalOpen(true);
  };

  return (
    <>
      {deleteModalOpen &&
        createPortal(
          <DeleteModal
            message={`Вы действительно хотите удалить цель: "${props.title}"?`}
            action={handleDeleteGoal}
            closeModal={() => setDeleteModalOpen(false)}
          />,
          document.body
        )}
      {infoModalOpen &&
        props.deletionResult === "success" &&
        createPortal(
          <InfoModal
            message={`Все прошло отлично!
                      Цель "${props.title}"  была успешно удалена.`}
            result={props.deletionResult}
            closeModal={() => setInfoModalOpen(false)}
          />,
          document.body
        )}
      {infoModalOpen &&
        props.deletionResult === "fail" &&
        createPortal(
          <InfoModal
            message={`Что-то пошло не так... \n
                      Цель "${props.title}" не была удалена.
                      Попробуйте позже еще раз.`}
            result={props.deletionResult}
            closeModal={() => setInfoModalOpen(false)}
          />,
          document.body
        )}
      <section className="card goal-card">
        <img
          className="goal-card__image"
          src={props.image}
          alt="иллюстрация к цели"
        />
        <div className="goal-card__content-wrapper">
          <div className="goal-card__info-wrapper">
            <Link to={"/goalPage/" + props.id} className="goal-card__link">
              <h3>{props.title}</h3>
            </Link>
            <p className="goal-card__progress">
              {props.freePixels} пикселей свободны
            </p>
          </div>
          <button
            className="goal-card__button goal-card__button--delete"
            onClick={handleDeleteModalOpen}
          ></button>
        </div>
      </section>
    </>
  );
};
export default GoalCard;
