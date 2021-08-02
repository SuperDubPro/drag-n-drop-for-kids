import './droppable.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Droppable({ uuid, text, onDragOver, onDrop, onDragEnter, onDragLeave, className }) {
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

  const handleDragEnter = (e) => {
    e.preventDefault();
    onDragEnter(e);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    onDragLeave(e);
  };

  useEffect(() => {
    const droppable = document.getElementById(`droppable-${uuid}`);
    droppable.addEventListener(`custom-drop-${uuid}`, handleTouchDrop);
    droppable.addEventListener(`custom-dragover-${uuid}`, handleDragOver);
    droppable.addEventListener(`custom-dragenter-${uuid}`, handleDragEnter);
    droppable.addEventListener(`custom-dragleave-${uuid}`, handleDragLeave);

    return () => {
      droppable.removeEventListener(`custom-drop-${uuid}`, handleTouchDrop);
      droppable.removeEventListener(`custom-dragover-${uuid}`, handleDragOver);
      droppable.removeEventListener(`custom-dragenter-${uuid}`, handleDragEnter);
      droppable.removeEventListener(`custom-dragleave-${uuid}`, handleDragLeave);
    };
  }, []);

  return (
    <div
      className={`droppable ${className} p-3 m-2`}
      id={`droppable-${uuid}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="text">{text}</div>
    </div>
  );
}

Droppable.propTypes = {
  text: PropTypes.string,
  uuid: PropTypes.string,
  className: PropTypes.string,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func
};

Droppable.defaultProps = {
  text: '',
  uuid: Math.random().toString(),
  className: '',
  onDragEnter: () => {},
  onDragOver: () => {},
  onDragLeave: () => {},
  onDrop: () => {}
};

export default Droppable;
