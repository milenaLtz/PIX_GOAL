import { useState } from "react";

const TaskCard = (props) => {
  const [isChecked, setIsChecked] = useState(false);

  const getPixelWord = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return "пикселей";
    }
    if (lastDigit === 1) {
        return "пиксель";
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return "пикселя";
    }
    return "пикселей";
  };

  const handleCheckButtonClick = () => {
    setIsChecked(true);
    if (props.onAddPixel) {
      props.onAddPixel();
    }
  };

  return(
      <>
        <div className={`tasks-block__task task ${isChecked ? "task--checked" : ""}`}>
          <div className="task__content-wrapper">
            <h3 className="task__title">{props.title}</h3>
            <p className="task__pixel-count"> {props.pixelCount} {getPixelWord(props.pixelCount)}</p>
          </div>
          <div className="task__button-wrapper">
            <button
            className={`task__button task__button--check ${isChecked ? "task__button--checked" : ""}`}
            onClick={isChecked ? null : handleCheckButtonClick}
            disabled={isChecked}></button>
            <button className={`task__button task__button--change ${isChecked ? "task__button--no-change" : ""}`}></button>
            <button className="task__button task__button--delete"></button>
          </div>
        </div>
      </>
  )
}
export default TaskCard;
