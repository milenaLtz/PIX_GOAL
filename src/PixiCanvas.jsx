import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as PIXI from 'pixi.js';
import { v4 as uuidv4 } from 'uuid';
import PixelInfoBlock from "./widgets/pixelInfoBlock";

const PixiCanvas = forwardRef(({ onOpenModal, onCloseModal, onUpdatePixelColor }, ref) => {

  const pixiContainer = useRef(null);
  const appRef = useRef(null);
  const [pixels, setPixels] = useState([]);
  const [selectedPixel, setSelectedPixel] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#DBD4E6');
  const [showModal, setShowModal] = useState(false);
  const scaleStep = 0.1;
  const minScale = 0.5;
  const maxScale = 2;

  const drawGrid = (stage, gridSize) => {
    const grid = new PIXI.Graphics();
    grid.lineStyle(1, 0xeeeeee, 1);

    for (let x = 0; x < appRef.current.screen.width; x += gridSize) {
        grid.moveTo(x, 0);
        grid.lineTo(x, appRef.current.screen.height);
    }

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

    const savedPixels = JSON.parse(localStorage.getItem('pixels')) || [];
    setPixels(savedPixels);

    savedPixels.forEach((pixel) => {
      addPixel(app.stage, pixel.x, pixel.y, pixel.color, pixel.id);
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []);

  const addPixel = (stage, x, y, color = '#DBD4E6', id = uuidv4()) => {
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
    pixel.drawRect(0, 0, 20, 20);
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
    updatePixelColor: (pixelId, newColor) => {
      console.log('New color:', newColor);
      const updatedPixels = pixels.map((pixel) =>
        pixel.id === pixelId ? { ...pixel, color: newColor } : pixel
      );
      setPixels(updatedPixels);
      localStorage.setItem('pixels', JSON.stringify(updatedPixels));
      const app = appRef.current;
      window.location.reload();
      const graphics = appRef.current.stage.children.find(
        (child) => child.pixelId === pixelId
      );

      if (graphics) {
        console.log('Found graphics object:', graphics);
        graphics.clear();
        graphics.beginFill(PIXI.utils.string2hex(newColor));
        graphics.drawRect(0, 0, 20, 20);  // Adjust size if necessary
        graphics.endFill();
        // Optionally, re-render manually
        app.renderer.render(app.stage);
        app.reload();
        // window.location.reload();
      } else {
        console.log('Graphics object not found for pixelId:', pixelId);
      }
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

   const handlePixelClick = (id) => {
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

  // useEffect(() => {
  //   if (appRef.current) {
  //     // Clear all existing pixels
  //     appRef.current.stage.removeChildren();

  //     // Redraw all pixels with updated colors
  //     pixels.forEach((pixel) => {
  //       addPixel(appRef.current.stage, pixel.x, pixel.y, pixel.color, pixel.id);
  //     });
  //   }
  // }, [pixels]);

  console.log(localStorage.getItem('pixels', JSON.stringify()))
  return(
      <>
          <div className="canvas-container">
            <div className="pixi-canvas block" ref={pixiContainer}></div>
          </div>
          <div>
            {/* <div className="pixi-canvas__button-wrapper">
              <button className="pixi-canvas__button button" onClick={zoomIn}>+</button>
              <button className="pixi-canvas__button button" onClick={zoomOut}>-</button>
            </div> */}
          </div>

      </>
  )
});

export default PixiCanvas;
