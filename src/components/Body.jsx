import { v1 as genUuid } from 'uuid';
import React from 'react';
import DATA from '../project-config';
import Draggable from './Draggable';
import Droppable from './Droppable';

const { scheme } = DATA;

const getShuffledArr = (array) => {
  const newArr = [...array];

  for (let i = newArr.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
  }

  return newArr;
};

function Body() {
  /** set mState */
  const [mState, setState] = React.useState(() => new Map(scheme.map((item, index) => {
    const uuid = genUuid();
    return [uuid, {
      uuid,
      text: item.text,
      name: item.name,
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
  const draggingUuidRef = React.useRef(null);

  /** set handlers */
  const handleDragStart = React.useCallback((e, uuid) => {
    draggingUuidRef.current = uuid;
    setTimeout(() => changeStateIteration((id, state) => {
      state.isDragging = id === uuid;
    }), 0);
  }, []);

  const handleDrop = React.useCallback((e, dropUuid) => {
    // console.log(e.currentTarget);
    const droppedUuid = draggingUuidRef.current;
    setCards(prevCard => prevCard.filter(cardUuid => cardUuid !== droppedUuid));
    changeStateIteration((cardUuid, state) => {
      state.isDragOver = false;
      state.isDragging = false;
      if (cardUuid === dropUuid) {
        state.droppedUuid = droppedUuid;
      } else {
        state.droppedUuid = state.droppedUuid === droppedUuid ? '' : state.droppedUuid;
      }
    });
  }, []);

  const handleDragEnd = React.useCallback(() => {
    draggingUuidRef.current = null;
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

  /** create some jsx elements */
  const createDroppable = (state) => {
    const { uuid, droppedUuid, isDragOver } = state;

    //  {(!state.droppedUuid || mState.get(state.droppedUuid).isDragging)
    return (
      <div
        className="interactive-container"
        key={`droppable-container-${uuid}`}
      >
        {!state.droppedUuid
          ? (
            <Droppable
              uuid={uuid}
              key={`droppable-component-${uuid}`}
              className={`border-dashed ${isDragOver ? 'hovered' : ''}`}
              onDrop={(e) => { handleDrop(e, uuid); }}
              onDragEnter={(e) => { handleDragEnter(e, uuid); }}
              onDragLeave={(e) => { handleDragLeave(e, uuid); }}
            />
          )
          : (
            <Draggable
              uuid={droppedUuid}
              key={`selected-card-${droppedUuid}`}
              text={mState.get(droppedUuid).text}
              className={mState.get(droppedUuid).isDragging ? 'hidden' : ''}
              onDragStart={(e) => { handleDragStart(e, droppedUuid); }}
              onDragEnd={(e) => { handleDragEnd(e, droppedUuid); }}
            />
          )}
      </div>
    );
  };

  const createDraggable = (state) => {
    const { uuid } = state;

    return (
      <div
        className="interactive-container"
        key={`draggable-container-${uuid}`}
      >
        <Draggable
          uuid={uuid}
          key={`draggable-component-${uuid}`}
          text={state.text}
          className={state.isDragging ? 'hidden' : ''}
          onDragStart={(e) => { handleDragStart(e, uuid); }}
          onDragEnd={(e) => { handleDragEnd(e, uuid); }}
        />
      </div>
    );
  };

  return (
    <div className="body">
      <div className="lists-container">
        <div className="interactive-list mb-3">
          {[...mState].map(([, state]) => createDroppable(state))}
        </div>

        <div className="interactive-list">
          {cards.map(uuid => {
            const card = mState.get(uuid);
            return createDraggable(card);
          })}
        </div>
      </div>
    </div>
  );
}

export default Body;
