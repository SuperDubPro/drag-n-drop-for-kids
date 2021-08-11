import { v1 as genUuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import DATA from '../project-config';
import Draggable from './Draggable';
import Droppable from './Droppable';
import Modal from './Modal';
import successImgs from '../assets/success';
import failImgs from '../assets/fail';

const { scheme } = DATA;
const successImgsArr = Object.keys(successImgs).map(key => successImgs[key]);
const failImgsArr = Object.keys(failImgs).map(key => failImgs[key]);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

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
      index,
      text: item.text,
      name: item.name,
      isDragOver: false,
      isDragging: false,
      droppedUuid: ''
    }];
  })));

  const changeStateIteration = (func) => {
    setState(prevState => new Map([...prevState].map(([uuid, cardState]) => {
      func(uuid, cardState);
      return [uuid, cardState];
    })));
  };

  const clearCard = (card) => {
    card.droppedUuid = '';
    card.isDragOver = false;
    card.isDragging = false;
  };

  /** set cardsOrder and cards */
  const [cardsOrder] = React.useState(() => getShuffledArr([...mState].map(([uuid]) => uuid)));
  const [cards, setCards] = React.useState(() => [...cardsOrder]);
  const draggingUuidRef = React.useRef(null);

  /** set some flags */
  const [isCorrect, setIsCorrect] = React.useState(() => false);
  const [isModalOpened, setIsModalOpened] = React.useState(() => false);

  /** set handlers */
  const handleDragStart = React.useCallback((e, uuid) => {
    draggingUuidRef.current = uuid;
    setTimeout(() => changeStateIteration((id, state) => {
      state.isDragging = id === uuid;
    }), 0);
  }, []);

  const handleDrop = React.useCallback((e, dropUuid) => {
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

  const handleCheckClick = () => {
    setIsCorrect([...mState].every(([uuid, state]) => state.droppedUuid === uuid));
    setIsModalOpened(true);
  };

  const handleResetAll = () => {
    changeStateIteration((uuid, card) => { clearCard(card); });
    setCards([...cardsOrder]);
  };

  const handleRemoveCard = (cardState) => {
    changeStateIteration((uuid, card) => {
      if (card.droppedUuid === cardState.uuid) { clearCard(card); }
    });
    setCards(prevCards => cardsOrder
      .filter(orderUuid => orderUuid === cardState.uuid
        || prevCards.some(prevUuid => prevUuid === orderUuid)));
  };

  const handleCloseModalButton = () => {
    setIsModalOpened(false);
  };

  const handleShowAnswers = () => {
    setIsModalOpened(false);
    changeStateIteration((uuid, card) => { card.droppedUuid = uuid; });
  };

  /** create some jsx elements */
  const createDroppable = (state) => {
    const { uuid, droppedUuid, isDragOver } = state;

    //  {(!state.droppedUuid || mState.get(state.droppedUuid).isDragging)
    return (
      <div
        className="interactive-container droppable-container mx-2"
        key={`droppable-container-${uuid}`}
      >
        <div className="name-row-container dark w-100 my-1">
          <div className="graph-arrow-container">
            <FontAwesomeIcon className="graph-arrow" icon={['fas', 'long-arrow-alt-down']} />
            <div className="name-row">{typeof state.name === 'string' ? state.name : null}</div>
          </div>
        </div>
        <div className="w-100">
          {!state.droppedUuid
            ? (
              <Droppable
                uuid={uuid}
                key={`droppable-component-${uuid}`}
                className={`border-dashed ${isDragOver ? 'hovered' : ''}`}
                onDrop={(e) => { handleDrop(e, uuid); }}
                onDragEnter={(e) => { handleDragEnter(e, uuid); }}
                onDragLeave={(e) => { handleDragLeave(e, uuid); }}
              >
                <div className="drop-index-container primary">
                  <div className="drop-index">
                    {state.index + 1}
                  </div>
                </div>
              </Droppable>
            )
            : (
              <Draggable
                uuid={droppedUuid}
                key={`selected-card-${droppedUuid}`}
                className={`${mState.get(droppedUuid).isDragging ? 'hidden' : ''}`}
                onDragStart={(e) => { handleDragStart(e, droppedUuid); }}
                onDragEnd={(e) => { handleDragEnd(e, droppedUuid); }}
              >
                <div className="dragged-card-body p-1">
                  <div>{mState.get(droppedUuid).text}</div>
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                  <button
                    type="button"
                    className="close-cross btn ml-2"
                    onClick={handleRemoveCard.bind(this, mState.get(droppedUuid))}
                  >
                    <FontAwesomeIcon icon={['fas', 'times']} />
                  </button>
                </div>
              </Draggable>
            )}
        </div>
      </div>
    );
  };

  const createDraggable = (state) => {
    const { uuid } = state;

    return (
      <div
        className="interactive-container m-2"
        key={`draggable-container-${uuid}`}
      >
        <Draggable
          uuid={uuid}
          className={`${state.isDragging ? 'hidden' : ''} w-100`}
          onDragStart={(e) => { handleDragStart(e, uuid); }}
          onDragEnd={(e) => { handleDragEnd(e, uuid); }}
        >
          <div className="p-1">{state.text}</div>
        </Draggable>
      </div>
    );
  };

  const createModalBody = () => (
    isCorrect
      ? (
        <div className="modal-content">
          <h1 className="success p-0 mt-0">Правильно!</h1>
          <img
            src={successImgsArr[getRandomInt(0, successImgsArr.length)]}
            alt="success_anime_gif"
          />
          <div className="button-block mt-4">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleCloseModalButton}
            >
              Ок
            </button>
          </div>
        </div>
      )
      : (
        <div className="modal-content">
          <h1 className="danger p-0 mt-0">Неправильно</h1>
          <img
            src={failImgsArr[getRandomInt(0, failImgsArr.length)]}
            alt="Тут должна была быть картинка, но даже в этом Вам не повезло :("
          />
          <div className="button-block mt-4">
            <button
              className="btn btn-success mr-2"
              type="button"
              onClick={handleShowAnswers}
            >
              Показать ответ
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleCloseModalButton}
            >
              Закрыть
            </button>
          </div>
        </div>
      )
  );

  // TODO разобраться почему работают приоритеты mr-0 над m-1 в bootstrap
  return (
    <div className="body">
      <div className="lists-container">
        <div className="interactive-list draggable-list p-4 my-4 mr-2 ml-4">
          <div className="draggable-list-wrapper w-100">
            {cards.map(uuid => {
              const card = mState.get(uuid);
              return createDraggable(card);
            })}
          </div>
        </div>

        <div className="prompt-arrow-container dark">
          <div className="prompt-arrow dark">
            <FontAwesomeIcon className="graph-arrow" icon={['fas', 'long-arrow-alt-right']} />
          </div>
          <div className="button-block m-2">
            <button
              className="btn btn-secondary mr-2"
              type="button"
              disabled={cards.length === mState.size ? 'disabled' : ''}
              onClick={handleResetAll}
            >
              Сбросить
            </button>
            <button
              className="btn btn-primary"
              type="button"
              disabled={cards.length ? 'disabled' : ''}
              onClick={handleCheckClick}
            >
              Проверить
            </button>
          </div>
        </div>

        <div className="interactive-list droppable-list p-4 my-4 mr-4 ml-2">
          <div className="droppable-list-wrapper w-100">
            {[...mState].map(([, state]) => createDroppable(state))}
          </div>
        </div>
      </div>
      {
        isModalOpened && (
          <Modal>
            {createModalBody()}
          </Modal>
        )
      }
    </div>
  );
}

export default Body;
