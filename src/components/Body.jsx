import { v1 as genUuid } from 'uuid';
import DATA from '../project-config';
import Draggable from './Draggable';
import Droppable from './Droppable';

function Body() {
  const { scheme } = DATA;
  const mScheme = new Map();

  scheme.forEach(text => {
    const uuid = genUuid();
    mScheme.set(uuid, { uuid, text, styleClass: '' });
  });

  const getShuffledArr = (array) => {
    const newArr = [...array];

    for (let i = newArr.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
    }

    return newArr;
  };

  const cardsOrder = getShuffledArr(Array.from(mScheme).map(([uuid]) => uuid));

  const handleDragStart = (e) => {
    console.log('handleDragStart', e);
  };

  const handleDrop = (e) => {
    console.log('handleDrop', e);
  };

  const handleDragEnd = (e) => {
    console.log('handleDragEnd', e);
  };

  // eslint-disable-next-line no-unused-vars
  const handleDragOver = (e) => {
    // console.log('handleDragOver', e);
  };

  const handleDragEnter = (e) => {
    console.log('handleDragEnter', e);
  };

  const handleDragLeave = (e) => {
    console.log('handleDragLeave', e);
  };

  return (
    <div className="body">
      <div className="drop-list">
        {Array.from(mScheme).map(([uuid]) => (
          <Droppable
            uuid={uuid}
            key={`droppable-component-${uuid}`}
            // text={state.text}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          />
        ))}
      </div>

      <div className="drag-list">
        {cardsOrder.map(uuid => (
          <Draggable
            uuid={uuid}
            key={`draggable-component-${uuid}`}
            text={mScheme.get(uuid).text}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default Body;
