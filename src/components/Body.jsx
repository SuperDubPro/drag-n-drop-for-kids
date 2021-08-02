import { v1 as genUuid } from 'uuid';
import React from 'react';
import DATA from '../project-config';
import Draggable from './Draggable';
import Droppable from './Droppable';

const getShuffledArr = (array) => {
  const newArr = [...array];

  for (let i = newArr.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
  }

  return newArr;
};

function Body() {
  const { scheme } = DATA;

  /** set mState */
  const [mState, setState] = React.useState(() => new Map(scheme.map((text, index) => {
    const uuid = genUuid();
    return [uuid, {
      uuid,
      text,
      isDragOver: false,
      isDragging: false,
      droppedUuid: '',
      index
    }];
  })));

  const changeStateIteration = (func) => {
    setState(prevState => new Map([...prevState].map(([id, cardState]) => {
      func(id, cardState);
      return [id, cardState];
    })));
  };

  /** set cardsOrder and cards */
  const [cardsOrder] = React.useState(() => getShuffledArr([...mState].map(([uuid]) => uuid)));
  const [cards, setCards] = React.useState(() => [...cardsOrder]);

  const handleDragStart = React.useCallback((e, uuid) => {
    setTimeout(() => changeStateIteration((id, state) => {
      state.isDragging = id === uuid;
    }), 0);
  }, []);

  const handleDrop = React.useCallback((e, droppedUuid) => {
    setCards(prevCard => prevCard.filter(cardUuid => cardUuid !== droppedUuid));
    changeStateIteration((cardUuid, state) => {
      state.isDragOver = false;
      state.isDragging = false;
      state.droppedUuid = cardUuid === droppedUuid ? droppedUuid : state.droppedUuid;
    });
  }, []);

  const handleDragEnd = React.useCallback(() => {
    changeStateIteration((id, state) => {
      state.isDragging = false;
    });
  }, []);

  const handleDragEnter = React.useCallback((e, uuid) => {
    changeStateIteration((id, state) => {
      state.isDragOver = id === uuid;
    });
  }, []);

  const handleDragLeave = React.useCallback(() => {
    changeStateIteration((id, state) => {
      state.isDragOver = false;
    });
  }, []);

  return (
    <div className="body">
      <div className="drop-list">
        {[...mState].map(([uuid, state]) => (
          <div
            key={`droppable-container-${uuid}`}
            style={{ width: '400px' }}
          >
            {!state.droppedUuid
              ? (
                <Droppable
                  uuid={uuid}
                  key={`droppable-component-${uuid}`}
                  className={`border-dashed ${state.isDragOver ? 'hovered' : ''}`}
                  onDrop={(e) => { handleDrop(e, uuid); }}
                  onDragEnter={(e) => { handleDragEnter(e, uuid); }}
                  onDragLeave={(e) => { handleDragLeave(e, uuid); }}
                />
              )
              : (
                <Draggable
                  uuid={state.droppedUuid}
                  key={`selected-card-${state.droppedUuid}`}
                  text={mState.get(state.droppedUuid).text}
                  className={mState.get(state.droppedUuid).isDragging ? 'hidden' : ''}
                  onDragStart={(e) => { handleDragStart(e, state.droppedUuid); }}
                  onDragEnd={(e) => { handleDragEnd(e, state.droppedUuid); }}
                />
              )}
          </div>
        ))}
      </div>

      <div className="drag-list">
        {cards.map(uuid => {
          const card = mState.get(uuid);
          return (
            <div
              key={`draggable-container-${uuid}`}
              style={{ width: '400px' }}
            >
              <Draggable
                uuid={uuid}
                key={`draggable-component-${uuid}`}
                text={card.text}
                className={card.isDragging ? 'hidden' : ''}
                onDragStart={(e) => { handleDragStart(e, uuid); }}
                onDragEnd={(e) => { handleDragEnd(e, uuid); }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Body;
