import './droppable.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Droppable({ uuid, onDragOver, onDrop, onDragEnter, onDragLeave, className, children }) {
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
      className={`interactive droppable ${className} p-2`}
      id={`droppable-${uuid}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {children}
    </div>
  );
}

Droppable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
  uuid: PropTypes.string,
  className: PropTypes.string,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func
};

Droppable.defaultProps = {
  children: null,
  uuid: Math.random().toString(),
  className: '',
  onDragEnter: () => {},
  onDragOver: () => {},
  onDragLeave: () => {},
  onDrop: () => {}
};

export default Droppable;
