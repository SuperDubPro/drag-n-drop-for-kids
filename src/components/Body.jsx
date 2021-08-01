import { v1 as genUuid } from 'uuid';
import DATA from '../project-config';
import Draggable from './Draggable';
import Droppable from './Droppable';

function Body() {
  const { scheme } = DATA;
  const mScheme = new Map();

  scheme.forEach(text => {
    mScheme.set(genUuid(), text);
  });

  const getShuffledArr = (array) => {
    const newArr = [...array];

    for (let i = newArr.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
    }

    return newArr;
  };

  const cards = getShuffledArr(Array.from(mScheme));

  const handleDragStart = (e) => {
    console.log('handleDragStart', e);
  };

  const handleDrop = (e) => {
    console.log('handleDrop', e);
  };

  const handleDragEnd = (e) => {
    console.log('handleDragEnd', e);
  };

  const handleDragOver = (e) => {
    console.log('handleDragOver', e);
  };

  return (
    <div className="body">
      <div className="drop-list">
        {Array.from(mScheme).map(([uuid, text]) => (
          <Droppable
            uuid={uuid}
            key={`droppable-component-${uuid}`}
            text={text}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        ))}
      </div>

      <div className="drag-list">
        {cards.map(([uuid, text]) => (
          <Draggable
            uuid={uuid}
            key={`draggable-component-${uuid}`}
            text={text}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default Body;
