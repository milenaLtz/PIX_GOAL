

const InfoModal = (props) => {

  const result = props.result;
  const message = props.message;
  const closeModal = props.closeModal;

  return (
    <>
      <div className="modal">
        <div className={`modal__container ${result === 'success' ? "modal__container--success" : "modal__container--fail"}`}>
          <p className="modal__info">{message}</p>
          <button className="modal__button button button--modal" onClick={closeModal}>Закрыть</button>
        </div>
      </div>
    </>
  )
}
export default InfoModal;
