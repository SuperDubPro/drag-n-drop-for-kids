import './droppable.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Droppable({ uuid, onDragOver, onDrop, className }) {
  const handleTouchDrop = (e) => {
    onDrop(e);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDrop = (e) => {
    onDrop(e);
  };

  useEffect(() => {
    const droppable = document.getElementById(`droppable-${uuid}`);
    droppable.addEventListener(`custom-drop-${uuid}`, handleTouchDrop);
    droppable.addEventListener(`custom-dragover-${uuid}`, handleDragOver);

    return () => {
      droppable.removeEventListener(`custom-drop-${uuid}`, handleTouchDrop);
      droppable.removeEventListener(`custom-dragover-${uuid}`, handleDragOver);
    };
  });

  return (
    <div
      className={`droppable ${className} p-3 m-2`}
      id={`droppable-${uuid}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );
}

Droppable.propTypes = {
  // text: PropTypes.string,
  uuid: PropTypes.string,
  className: PropTypes.string,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func
};

Droppable.defaultProps = {
  // text: '',
  uuid: Math.random().toString(),
  className: '',
  onDragOver: () => {},
  onDrop: () => {}
};

export default Droppable;
