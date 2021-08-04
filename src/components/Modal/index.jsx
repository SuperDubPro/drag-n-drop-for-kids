import './modal.scss';
import PropTypes from 'prop-types';

function Modal({ className, children }) {
  return (
    <div className="modal-wrapper">
      <div
        className={`modal ${className} p-4`}
      >
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any
};

Modal.defaultProps = {
  className: '',
  children: null
};

export default Modal;
