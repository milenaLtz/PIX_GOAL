import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as PIXI from 'pixi.js';
import { v4 as uuidv4 } from 'uuid';
import PixelInfoBlock from "./widgets/pixelInfoBlock";

const PixiCanvas = forwardRef(({ onOpenModal, onCloseModal }, ref) => {

  const pixiContainer = useRef(null);
  const appRef = useRef(null);
  const [pixels, setPixels] = useState([]);
  const [selectedPixel, setSelectedPixel] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#0000ff');
  const [showModal, setShowModal] = useState(false);
  const scaleStep = 0.1;
  const minScale = 0.5;
  const maxScale = 2;

  // useEffect(() => {
  //   // Отслеживание закрытия вкладки или браузера
  //   const handleBeforeUnload = (event) => {
  //     const message = "У вас есть несохранённые изменения. Вы точно хотите уйти?";
  //     event.returnValue = message; // Показ уведомления в некоторых браузерах
  //     return message;
  //   };

  //   // Отслеживание смены вкладки
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'hidden') {
  //       // Отправка уведомления при переходе на другую вкладку
  //       if (Notification.permission === 'granted') {
  //         new Notification("Вернитесь, чтобы сохранить изменения!");
  //       }
  //     }
  //   };

  //   // Добавляем обработчики
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   // Запрос разрешения на отправку уведомлений
  //   if (Notification.permission !== 'granted') {
  //     Notification.requestPermission();
  //   }

  //   return () => {
  //     // Удаление обработчиков при размонтировании компонента
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  const drawGrid = (stage, gridSize) => {
    const grid = new PIXI.Graphics();
    grid.lineStyle(1, 0xeeeeee, 1); // Grau für das Gitter

    // Vertikale Linien
    for (let x = 0; x < appRef.current.screen.width; x += gridSize) {
        grid.moveTo(x, 0);
        grid.lineTo(x, appRef.current.screen.height);
    }

    // Horizontale Linien
    for (let y = 0; y < appRef.current.screen.height; y += gridSize) {
        grid.moveTo(0, y);
        grid.lineTo(appRef.current.screen.width, y);
    }

    stage.addChild(grid);
};

  useEffect(() => {
    const app = new PIXI.Application({
      width: 600,
      height: 500,
      backgroundColor: 0xffffff,
    });

    pixiContainer.current.appendChild(app.view);
    appRef.current = app;

    drawGrid(app.stage, gridSize);

    // Восстанавливаем пиксели из LocalStorage при загрузке
    const savedPixels = JSON.parse(localStorage.getItem('pixels')) || [];
    setPixels(savedPixels); // Сохраняем в состояние

    savedPixels.forEach((pixel) => {
      addPixel(app.stage, pixel.x, pixel.y, pixel.color, pixel.id);
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []);

  const addPixel = (stage, x, y, color = '#0000ff', id = uuidv4()) => {
    const existingPixel = pixels.find(pixel => pixel.id === id);
    if (existingPixel) {
      setPixels(prev => {
        const updatedPixels = prev.map(p => (p.id === id ? { ...p, x, y, color } : p));
        localStorage.setItem('pixels', JSON.stringify(updatedPixels));
        return updatedPixels;
      });
      return;
    }

    const pixel = new PIXI.Graphics();
    pixel.beginFill(PIXI.utils.string2hex(color));
    pixel.drawRect(0, 0, 10, 10);
    pixel.endFill();
    pixel.position.set(x, y);
    pixel.interactive = true;
    pixel.cursor = 'pointer';
    pixel.on('pointerdown', (event) => onSelectPixel(event, id));
    pixel.on('pointerdown', onDragStart);
    pixel.on('pointerup', (event) => onDragEnd(event, id));
    pixel.on('pointerupoutside', (event) => onDragEnd(event, id));
    pixel.on('pointermove', onDragMove);

    stage.addChild(pixel);

    setPixels((prev) => {
      const existingPixel = prev.find(p => p.id === id);
      if (!existingPixel) {
        const newPixel = { id, x: pixel.x, y: pixel.y, color };
        const updatedPixels = [...prev, newPixel];
        localStorage.setItem('pixels', JSON.stringify(updatedPixels));
        return updatedPixels;
      }
      return prev;
    });
  };

  const createPixel = () => {
    const app = appRef.current;
    addPixel(app.stage, app.screen.width / 2, app.screen.height / 2, selectedColor);
  };

  useImperativeHandle(ref, () => ({
    addPixel: (x, y, color) => {
      if (!appRef.current) {
        console.error('PIXI Application not initialized');
        return;
      }
      addPixel(appRef.current.stage, x, y, color);
    },
  }));

  const onSelectPixel = (event, id) => {
    event.stopPropagation();
    setSelectedPixel(id);
    handlePixelClick(id);
  };

  const deletePixel = () => {
    if (!selectedPixel) return;

    const app = appRef.current;
    const updatedPixels = pixels.filter(pixel => pixel.id !== selectedPixel.id);

    setPixels(updatedPixels);
    localStorage.setItem('pixels', JSON.stringify(updatedPixels));

    const pixelToDelete = app.stage.children.find(p => p.id === selectedPixel.id);
    if (pixelToDelete) {
      app.stage.removeChild(pixelToDelete);
      pixelToDelete.destroy();
    }
    setSelectedPixel(null);
    setShowModal(false);
  };

  const onDragStart = (event) => {
    const pixel = event.currentTarget;
    pixel.dragData = event.data;
    pixel.dragging = true;
  };

  const onDragEnd = (event, id) => {
    const pixel = event.currentTarget;
    pixel.dragging = false;
    pixel.dragData = null;

    setPixels((prev) => {
      const updatedPixels = prev.map((p) =>
        p.id === id ? { ...p, x: pixel.x, y: pixel.y } : p
      );
      localStorage.setItem('pixels', JSON.stringify(updatedPixels));
      return updatedPixels;
    });

    handlePixelClick(id);
  };

  const gridSize = 10;

  const onDragMove = (event) => {
    const pixel = event.currentTarget;
    if (pixel.dragging) {
        const newPosition = pixel.dragData.getLocalPosition(pixel.parent);

        const clampedX = Math.max(0, Math.min(newPosition.x, appRef.current.renderer.width - gridSize));
        const clampedY = Math.max(0, Math.min(newPosition.y, appRef.current.renderer.height - gridSize));

        if (newPosition.x < 0 || newPosition.x > appRef.current.renderer.width - gridSize ||
          newPosition.y < 0 || newPosition.y > appRef.current.renderer.height - gridSize) {
        return;
      }

        // Position auf das Gitter runden
        pixel.x = Math.round(newPosition.x / gridSize) * gridSize;
        pixel.y = Math.round(newPosition.y / gridSize) * gridSize;
    }
};

  const changePixelColor = (event) => {
    setSelectedColor(event.target.value);
    if (!selectedPixel) return;

    const app = appRef.current;
    const updatedPixels = pixels.map(pixel =>
      pixel.id === selectedPixel ? { ...pixel, color: event.target.value } : pixel
    );

    setPixels(updatedPixels);
    localStorage.setItem('pixels', JSON.stringify(updatedPixels));

    const pixelToUpdate = app.stage.children.find(p => p.id === selectedPixel);
    if (pixelToUpdate) {
      app.stage.removeChild(pixelToUpdate);
      pixelToUpdate.destroy();

      const updatedPixelData = updatedPixels.find(p => p.id === selectedPixel);
      addPixel(app.stage, updatedPixelData.x, updatedPixelData.y, updatedPixelData.color, updatedPixelData.id);
    }
};

  const zoomIn = () => {
    const app = appRef.current;
    const newScale = Math.min(app.stage.scale.x + scaleStep, maxScale);
    app.stage.scale.set(newScale);
  };

  const zoomOut = () => {
    const app = appRef.current;
    const newScale = Math.max(app.stage.scale.x - scaleStep, minScale);
    app.stage.scale.set(newScale);
  };

   const handlePixelClick = (id) => {
    // Показываем модальное окно
    const savedPixels = JSON.parse(localStorage.getItem('pixels')) || [];
    const pixelData = savedPixels.find(pixel => pixel.id === id);
    console.log('Открыть модальное окно для пикселя с ID:', id);
    if (pixelData) {
      setSelectedPixel(pixelData);
    }
    onOpenModal(pixelData);
  };

  console.log(selectedPixel)


  const closeModal = () => {
    onCloseModal();
  };


  console.log(localStorage.getItem('pixels', JSON.stringify()))
    return(
        <>
            <div className="canvas-container">
              <div className="pixi-canvas block" ref={pixiContainer}></div>
              {/* {showModal && (
                  <PixelInfoBlock selectedPixel={selectedPixel} closeModal={closeModal}/>
              )} */}
            </div>
            <div>
              <div className="pixi-canvas__button-wrapper">
                {/* <button className="pixi-canvas__button button" onClick={createPixel}>Add Pixel</button> */}
                <button className="pixi-canvas__button button" onClick={zoomIn}>+</button>
                <button className="pixi-canvas__button button" onClick={zoomOut}>-</button>
                {/* {selectedPixel && (
                  <>
                    <button className="pixi-canvas__button button" onClick={deletePixel}>Delete Selected Pixel</button>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={changePixelColor}
                      style={{ marginLeft: '10px' }}
                    />
                  </>
                )} */}
              </div>
                {/* {selectedPixel && (
                  <>
                    <button className="pixi-canvas__button button" onClick={deletePixel}>Delete Selected Pixel</button>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={changePixelColor}
                      style={{ marginLeft: '10px' }}
                    />
                  </>
                )} */}
            </div>

        </>
    )
});

export default PixiCanvas;
