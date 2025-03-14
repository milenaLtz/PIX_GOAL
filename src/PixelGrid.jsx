
import { useState, useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';

const PixelGrid = ({ gridSize }) => {

    const [grid, setGrid] = useState(
        Array(gridSize).fill(null).map(() => Array(gridSize).fill(null))
    );
    
    console.log(grid)

    const [selectedColor, setSelectedColor] = useState('#CFB8FF');
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    const [selectedPixel, setSelectedPixel] = useState(null); // Active pixel {row, col, color}

    const gridRef = useRef(null);

    //функция добавления пикселя
    const addPixel = (row, col) => {
        const newGrid = [...grid];
        for (row; row < gridSize; row++) {
            for (col; col < gridSize; col++) {
                if (newGrid[row][col] === null) {
                    newGrid[row][col] = selectedColor;
                    console.log(col, row)
                    setGrid(newGrid);
                    return;
                }
            }
        }
    };

    //функция передвижения пикселя
    const movePixel = (oldCoords, newCoords) => {
        const { oldRow, oldCol } = oldCoords;
        const { newRow, newCol } = newCoords;

        if (grid[newRow][newCol] === null) {
            const newGrid = [...grid];
            newGrid[newRow][newCol] = newGrid[oldRow][oldCol];
            newGrid[oldRow][oldCol] = null; 
            setGrid(newGrid);
        } else {
            console.log('Целевая клетка занята');
        }
    };

    // // Change pixel color
    // const changePixelColor = (row, col) => {
    //     if (grid[row][col] !== null) {
    //         const newGrid = [...grid];
    //         newGrid[row][col] = selectedColor;
    //         setGrid(newGrid);
    //     }
    // };

    // Delete a pixel
    const deletePixel = (row, col) => {
        if (grid[row][col] !== null) {
            const newGrid = [...grid];
            newGrid[row][col] = null;
            setGrid(newGrid);
        }
    };

    const handlePixelClick = (row, col) => {
        setSelectedPixel({ row, col, color: grid[row][col] });
    };

    const handleColorChange = (color) => {
        if (selectedPixel) {
            const newGrid = [...grid];
            newGrid[selectedPixel.row][selectedPixel.col] = color;
            setGrid(newGrid);
            setSelectedPixel({ ...selectedPixel, color });
        }
    };

    const PIXEL_TYPE = 'PIXEL';

    const Pixel = ({ row, col, color}) => {
        const [{ isDragging }, dragRef] = useDrag({
            type: PIXEL_TYPE,
            item: { row, col },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const [, dropRef] = useDrop({
            accept: PIXEL_TYPE,
            drop: (item, monitor) => {
                const gridElement = gridRef.current;
                const gridRect = gridElement.getBoundingClientRect();
                const newCoords = monitor.getClientOffset();

                const offsetX = newCoords.x - gridRect.left;
                const offsetY = newCoords.y - gridRect.top;

                const newCol = Math.floor((offsetX / gridRect.width) * gridSize);
                const newRow = Math.floor((offsetY / gridRect.height) * gridSize);

                movePixel({ oldRow: item.row, oldCol: item.col }, { newRow, newCol });
            },
        });

        const isTransparent = color === 'transparent' || color === null;

        return (
            <div
                ref={(node) => dragRef(dropRef(node))}
                style={{
                    backgroundColor: color,
                    gridColumn: `${col + 1}`,
                    gridRow: `${row + 1}`,
                    width: '100%',
                    height: '100%',
                    opacity: isDragging ? 0.5 : 1,
                    cursor: isTransparent ? 'default' : 'pointer',
                    }}
                    onClick={() => handlePixelClick(row, col)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        deletePixel(row, col);
                    }}
                />
            );
        };

    return (
        <div className="grid-container">
            <div
                className="grid-container__grid"
                ref={gridRef}
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((color, colIndex) => {
                        return(
                        <Pixel
                            key={`${rowIndex}-${colIndex}`}
                            row={rowIndex}
                            col={colIndex}
                            color={color || 'transparent'}
                        />
                        )
})
                )}
            </div>
            <div className="grid-container__button-input-wrapper">
                {/* <input
                    className="grid-container__input-color"
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                /> */}
                {/* <div className="grid-container__input-wrapper">
                    <label htmlFor="row">Введите номер строки</label>
                    <input
                        id="row"
                        className="grid-container__input"
                        type="text"
                        value={row}
                        onChange={(e) => setRow(e.target.value)}
                    />
                </div>
                <div className="grid-container__input-wrapper">
                    <label htmlFor="col">Введите номер столбца</label>
                    <input
                        id="col"
                        className="grid-container__input"
                        type="text"
                        value={col}
                        onChange={(e) => setCol(e.target.value)}
                    />
                </div> */}
            </div>
            {/* <button className="grid-container__button button" onClick={() => addPixel(row, col)}>Добавить задачу</button> */}
            <div className="grid-container__controls">
                <button className="grid-container__button button" onClick={() => addPixel(row, col)}>Add Pixel</button>
                {selectedPixel && (
                    <div className="grid-container__selected-pixel">
                        <p>Selected Pixel: Row {selectedPixel.row}, Col {selectedPixel.col}</p>
                        <input
                            type="color"
                            value={selectedPixel.color}
                            onChange={(e) => handleColorChange(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PixelGrid;



    