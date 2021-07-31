import './droppable.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Droppable({ uuid, onDragOver, onDrop }) {
  const handleTouchDrop = (e) => {
    onDrop(e);
  };

  useEffect(() => {
    const droppable = document.getElementById(`droppable-${uuid}`);
    // droppable.addEventListener('touchstart', handleTouchDrop);
    droppable.addEventListener(`custom-event-${uuid}`, handleTouchDrop);
    droppable.addEventListener('drop', handleTouchDrop);

    return () => {
      droppable.removeEventListener(`custom-event-${uuid}`, handleTouchDrop);
      droppable.removeEventListener('drop', handleTouchDrop);
    };
  });

  return (
    <div
      className="droppable p-3 m-2"
      id={`droppable-${uuid}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  );
}

Droppable.propTypes = {
  // text: PropTypes.string,
  uuid: PropTypes.string,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func
};

Droppable.defaultProps = {
  // text: '',
  uuid: Math.random().toString(),
  onDragOver: () => {},
  onDrop: () => {}
};

export default Droppable;
