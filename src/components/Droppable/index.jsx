import './droppable.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Droppable({ uuid, onDragOver, onDrop }) {
  const onTouchDrop = (e) => {
    // if (this.ondrop_) { this.ondrop_(e); m.redraw() }
    // console.log('Droppable', onDrop, e);
    onDrop(e);
  };

  const handleTouchDrop = (e) => { onTouchDrop(e); };

  useEffect(() => {
    const droppable = document.getElementById(`droppable-${uuid}`);
    droppable.addEventListener('touchstart', handleTouchDrop);

    return () => {
      droppable.removeEventListener('touchstart', handleTouchDrop);
    };
  });

  return (
    <div
      className="droppable p-3 m-2"
      id={`droppable-${uuid}`}
      onDragOver={(e) => { onDragOver(e); }}
      onDrop={(e) => { onDrop(e); }}
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
