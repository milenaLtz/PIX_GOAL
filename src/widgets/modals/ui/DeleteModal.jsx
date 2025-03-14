import { useState } from "react";


const DeleteModal = (props) => {

  const message = props.message;
  const action = props.action;
  const closeModal = props.closeModal;


  return (
    <>
      <div className="modal">
        <div className="modal__container">
          <p className="modal__info">{message}</p>
          <div className="modal__button-wrapper">
            <button className="modal__button button button--modal" onClick={action}>Удалить</button>
            <button className="modal__button button button--modal" onClick={closeModal}>Отменить</button>
          </div>
        </div>
      </div>
    </>
  )
}
export default DeleteModal;
