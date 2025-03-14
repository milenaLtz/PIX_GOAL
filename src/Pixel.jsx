import { useDrag, useDrop } from 'react-dnd'

const PIXEL_TYPE = 'PIXEL';

const Pixel = (props) => {
    
    console.log(props.pixel)
    // const [{ isDragging }, dragRef] = useDrag({
    //   type: PIXEL_TYPE,
    //   item: { id: pixel.pixelId },
    //   collect: (monitor) => ({
    //     isDragging: monitor.isDragging(),
    //   }),
    // });
  
    // const [, dropRef] = useDrop({
    //   accept: PIXEL_TYPE,
    //   drop: (item, monitor) => {
    //     const newCoords = monitor.getClientOffset();
    //     const gridSize = 10; 
  
    //     const columnCoord = [
    //       Math.floor(newCoords.x / gridSize) + 1,
    //       Math.floor(newCoords.x / gridSize) + 2,
    //     ];
    //     const rowCoord = [
    //       Math.floor(newCoords.y / gridSize) + 1,
    //       Math.floor(newCoords.y / gridSize) + 2,
    //     ];
  
    //     movePixel(item.id, { columnCoord, rowCoord });
    //   },
    // });
  
    return (
      <div
        // ref={(node) => dragRef(dropRef(node))}
        style={{
          backgroundColor: `${props.pixel.color}`,
          gridColumn: `${props.pixel.columnCoord[0]} / ${props.pixel.columnCoord[1]}`,
          gridRow: `${props.pixel.rowCoord[0]} / ${props.pixel.rowCoord[1]}`,
        //   opacity: isDragging ? 0.5 : 1,
        }}
      />
    );
  };

export default Pixel;
  