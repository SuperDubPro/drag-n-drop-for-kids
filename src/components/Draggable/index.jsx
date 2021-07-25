import './draggable.scss';
import PropTypes from 'prop-types';

function Draggable({ text }) {
  return (
    <div className="draggable p-2 m-1">{text}</div>
  );
}

Draggable.propTypes = {
  text: PropTypes.string
};

Draggable.defaultProps = {
  text: ''
};

export default Draggable;
