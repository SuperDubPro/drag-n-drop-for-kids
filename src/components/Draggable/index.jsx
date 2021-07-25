import './draggable.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Draggable({ text, uuid, onMouseDown, onMouseUp, onDragEnd }) {
  const coordinates = {
    leftCorrection: 0,
    topCorrection: 0,
    pageHeight: 0,
    pageWidth: 0,
    clientHeight: 0,
    clientWidth: 0
  };
  let draggableClone = null;

  const clearState = () => {
    if (draggableClone) { draggableClone.remove(); }
    draggableClone = null;
    coordinates.leftCorrection = 0;
    coordinates.topCorrection = 0;
    coordinates.pageHeight = 0;
    coordinates.pageWidth = 0;
    coordinates.clientHeight = 0;
    coordinates.clientWidth = 0;
  };

  const onTouchStart = (e) => {
    onMouseDown(e);
    // m.redraw()
  };

  const onTouchEnd = (e) => {
    clearState();

    if (!e.target.matches('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')) {
      if (e.cancelable) { e.preventDefault(); }
      const touch = e.changedTouches[0];
      const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);

      if (elemBelow?.classList.contains('custom-droppable')) {
        const event = new Event(elemBelow.id);
        elemBelow.dispatchEvent(event);
      }
    }

    // if (this.onmouseup_) { this.onmouseup_(e) }
    onMouseUp(e);
    // if (this.ondragend_) { this.ondragend_(e) }
    onDragEnd(e);

    // m.redraw()
  };

  const onTouchCancel = (e) => {
    if (e.cancelable) { e.preventDefault(); }
    clearState();

    // if (this.onmouseup_) { this.onmouseup_(e) }
    onMouseUp(e);
    // if (this.ondragend_) { this.ondragend_(e) }
    onDragEnd(e);
    // m.redraw()
  };

  const isOverflown = (element) => {
    const { classList } = element;
    return classList.contains('overflow-auto') || classList.contains('overflow-auto-x') || classList.contains('overflow-auto-y');
  };

  const dragScroll = (e) => {
    const touch = e.targetTouches[0];
    const scrollZonePx = 25;
    const elemsBelow = document.elementsFromPoint(touch.clientX, touch.clientY);

    // TODO Исправить баг: если при портретной ориентации завести draggable элемент за правый край, то при перетаскивании вправо будет происходить скрол вверх (без срабатывания логики ниже). WTF???!!
    if (
      window.scrollY + coordinates.clientHeight < coordinates.pageHeight
      && touch.clientY >= (coordinates.clientHeight - scrollZonePx)
      && touch.pageY <= coordinates.pageHeight
    ) {
      // page down
      window.scrollBy(0, (touch.clientY - (coordinates.clientHeight - scrollZonePx)) * 2);
    } else if (window.scrollY > 0 && touch.clientY <= scrollZonePx && touch.pageY >= 0) {
      // page up
      window.scrollBy(0, -Math.abs(scrollZonePx - Math.abs(touch.clientY)) * 2);
    } else if (
      window.scrollX + coordinates.clientWidth < coordinates.pageWidth
      && touch.clientX >= (coordinates.clientWidth - scrollZonePx)
      && touch.clientX <= coordinates.pageWidth
    ) {
      // page right
      window.scrollBy((touch.clientX - (coordinates.clientWidth - scrollZonePx)) * 2, 0);
    } else if (window.scrollX > 0 && touch.clientX <= scrollZonePx && touch.pageX >= 0) {
      // page left
      window.scrollBy(-Math.abs(scrollZonePx - Math.abs(touch.clientX)) * 2, 0);
    } else if (elemsBelow) {
      const cloneIndex = elemsBelow.findIndex(elem => elem.id === `clone-${uuid}`);
      elemsBelow.splice(0, cloneIndex + 1);

      elemsBelow.some(elem => {
        if (isOverflown(elem)) {
          const elemBox = elem.getBoundingClientRect();
          // overflown element up
          if (touch.clientY <= elemBox.top + scrollZonePx && touch.clientY > elemBox.top && touch.pageY >= 0) {
            elem.scrollBy(0, -Math.abs(elemBox.top + scrollZonePx - Math.abs(touch.clientY)) * 2);
          }
          // overflown element down
          if (touch.clientY >= elemBox.bottom - scrollZonePx && touch.clientY <= elemBox.bottom && touch.pageY <= coordinates.pageHeight) {
            elem.scrollBy(0, (touch.clientY - (elemBox.bottom - scrollZonePx)) * 2);
          }
          // overflown element left
          if (touch.clientX <= elemBox.left + scrollZonePx && touch.clientX > elemBox.left && touch.pageX >= 0) {
            elem.scrollBy(-Math.abs(elemBox.left + scrollZonePx - touch.clientX) * 2, 0);
          }
          // overflown element right
          if (touch.clientX >= elemBox.right - scrollZonePx && touch.clientX <= elemBox.right && touch.pageX <= coordinates.pageWidth) {
            elem.scrollBy((touch.clientX - (elemBox.right - scrollZonePx)) * 2, 0);
          }
          return true;
        }
        return false;
      });
    }
  };

  const onTouchMove = (e) => {
    if (e.cancelable) { e.preventDefault(); }
    const draggable = e.currentTarget;
    const touch = e.targetTouches[0];
    const { documentElement } = document;

    if (!draggableClone) {
      draggableClone = draggable.cloneNode(true);
      const cloneStyle = draggableClone.style;
      const box = draggable.getBoundingClientRect();

      coordinates.leftCorrection = touch.clientX - box.left;
      coordinates.topCorrection = touch.clientY - box.top;

      draggableClone.id = `clone-${uuid}`;
      // this.draggableClone_.id = `clone-${this.uuid_}`
      cloneStyle.position = 'absolute';
      cloneStyle.zIndex = 1020;
      cloneStyle.opacity = 0.5;
      cloneStyle.width = draggable.offsetWidth;
      cloneStyle.height = draggable.offsetHeight;
      cloneStyle.left = `${touch.pageX - coordinates.leftCorrection}px`;
      cloneStyle.top = `${touch.pageY - coordinates.topCorrection}px`;

      document.body.append(draggableClone);

      coordinates.pageHeight = Math.max(
        document.body.scrollHeight, documentElement.scrollHeight,
        document.body.offsetHeight, documentElement.offsetHeight,
        document.body.clientHeight, documentElement.clientHeight
      );
      coordinates.pageWidth = Math.max(
        document.body.scrollWidth, documentElement.scrollWidth,
        document.body.offsetWidth, documentElement.offsetWidth,
        document.body.clientWidth, documentElement.clientWidth
      );
      coordinates.clientHeight = Math.max(window.innerHeight, documentElement.clientHeight);
      coordinates.clientWidth = Math.max(window.innerWidth, documentElement.clientWidth);
    }

    dragScroll(e);

    // const draggableClone = this.draggableClone_
    const cloneStyle = draggableClone.style;
    cloneStyle.position = 'absolute';
    cloneStyle.left = `${touch.pageX - coordinates.leftCorrection}px`;
    cloneStyle.top = `${touch.pageY - coordinates.topCorrection}px`;
  };

  const handleTouchStart = (e) => { onTouchStart(e); };
  const handleTouchMove = (e) => { onTouchMove(e); };
  const handleTouchEnd = (e) => { onTouchEnd(e); };
  const handleTouchCancel = (e) => { onTouchCancel(e); };

  useEffect(() => {
    const draggable = document.getElementById(`draggable-${uuid}`);
    draggable.addEventListener('touchstart', handleTouchStart);
    draggable.addEventListener('touchmove', handleTouchMove);
    draggable.addEventListener('touchend', handleTouchEnd);
    draggable.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      draggable.removeEventListener('touchstart', handleTouchStart);
      draggable.removeEventListener('touchmove', handleTouchMove);
      draggable.removeEventListener('touchend', handleTouchEnd);
      draggable.removeEventListener('touchcancel', handleTouchCancel);
    };
  });

  return (
    <div
      className="draggable p-2 m-2"
      draggable="true"
      id={`draggable-${uuid}`}
      // onmousedown: event => { if (this.onmousedown_) { this.onmousedown_(event) } },
      // onmouseup: event => { if (this.onmouseup_) { this.onmouseup_(event) } },
      onMouseDown={(e) => { onMouseDown(e); }}
      onMouseUp={(e) => { onMouseUp(e); }}
      onDragEnd={(e) => { onDragEnd(e); }}
    >
      {text}
    </div>
  );
}

Draggable.propTypes = {
  text: PropTypes.string,
  uuid: PropTypes.string,
  onMouseUp: PropTypes.func,
  onMouseDown: PropTypes.func,
  onDragEnd: PropTypes.func
};

Draggable.defaultProps = {
  text: '',
  uuid: Math.random().toString(),
  onMouseUp: () => {},
  onMouseDown: () => {},
  onDragEnd: () => {}
};

export default Draggable;
