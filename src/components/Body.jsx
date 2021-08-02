import { v1 as genUuid } from 'uuid';
import React from 'react';
import DATA from '../project-config';
import Draggable from './Draggable';
import Droppable from './Droppable';

function Body() {
  const { scheme } = DATA;

  /** set mState */
  const [mState, setState] = React.useState(new Map(scheme.map(text => {
    const uuid = genUuid();
    return [uuid, { uuid, text, isHovered: false, isVisible: true }];
  })));

  const changeStateIteration = (func) => {
    setState(new Map(Array.from(mState).map(([id, cardState]) => {
      func(id, cardState);
      return [id, cardState];
    })));
  };

  /** set cardsOrder */
  const getShuffledArr = (array) => {
    const newArr = [...array];

    for (let i = newArr.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
    }

    return newArr;
  };
  const [cardsOrder, setCardsOrder] = React.useState([]);
  React.useEffect(() => {
    setCardsOrder(getShuffledArr(Array.from(mState).map(([uuid]) => uuid)));
  }, []);

  const handleDragStart = React.useCallback((e, uuid) => {
    console.log('handleDragStart', uuid);
    setTimeout(() => changeStateIteration((id, state) => {
      state.isVisible = id !== uuid;
    }), 0);
  }, []);

  const handleDrop = React.useCallback((e) => {
    console.log('handleDrop', e);
    changeStateIteration((id, state) => {
      state.isHovered = false;
    });
  }, []);

  const handleDragEnd = React.useCallback((e, uuid) => {
    changeStateIteration((id, state) => {
      if (id === uuid) { state.isVisible = true; }
    });
  }, []);

  const handleDragEnter = React.useCallback((e, uuid) => {
    changeStateIteration((id, state) => {
      state.isHovered = id === uuid;
    });
  }, []);

  const handleDragLeave = React.useCallback(() => {
    changeStateIteration((id, state) => {
      state.isHovered = false;
    });
  }, []);

  return (
    <div className="body">
      <div className="drop-list">
        {Array.from(mState).map(([uuid]) => (
          <Droppable
            uuid={uuid}
            key={`droppable-component-${uuid}`}
            className={mState.get(uuid).isHovered ? 'hovered' : ''}
            onDrop={(e) => { handleDrop(e, uuid); }}
            onDragEnter={(e) => { handleDragEnter(e, uuid); }}
            onDragLeave={(e) => { handleDragLeave(e, uuid); }}
          />
        ))}
      </div>

      <div className="drag-list">
        {cardsOrder.map(uuid => {
          const card = mState.get(uuid);
          return (
            <Draggable
              uuid={uuid}
              key={`draggable-component-${uuid}`}
              text={card.uuid}
              className={card.isVisible ? '' : 'hidden'}
              onDragStart={(e) => { handleDragStart(e, uuid); }}
              onDragEnd={(e) => { handleDragEnd(e, uuid); }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Body;
