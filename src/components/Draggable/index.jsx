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
  let isMouseDown = false;

  const clearState = () => {
    if (draggableClone) { draggableClone.remove(); }
    draggableClone = null;
    isMouseDown = false;
    coordinates.leftCorrection = 0;
    coordinates.topCorrection = 0;
    coordinates.pageHeight = 0;
    coordinates.pageWidth = 0;
    coordinates.clientHeight = 0;
    coordinates.clientWidth = 0;
  };

  const getRealStyle = (elem, style) => {
    let computedStyle;
    if (typeof elem.currentStyle !== 'undefined') {
      computedStyle = elem.currentStyle;
    } else {
      computedStyle = document.defaultView.getComputedStyle(elem, null);
    }

    return style ? computedStyle[style] : computedStyle;
  };

  const copyComputedStyle = (elem, clone) => {
    const computedStyle = getRealStyle(elem);
    Object.keys(computedStyle).forEach(key => {
      const realStyle = computedStyle[key];
      // Do not use `hasOwnProperty`, nothing will get copied
      if (
        typeof computedStyle[realStyle] === 'string'
        && computedStyle[realStyle]
        && realStyle !== 'cssText'
        && !/\d/.test(realStyle)
      ) {
        try {
          clone.style[realStyle] = computedStyle[realStyle];
          // `fontSize` comes before `font` If `font` is empty, `fontSize` gets
          // overwritten.  So make sure to reset this property. (hackyhackhack)
          // Other properties may need similar treatment
          if (realStyle === 'font') {
            clone.style.fontSize = computedStyle.fontSize;
          }
          // }
        } catch (e) {
          throw (new Error(`Ошибка при клонировании стиля ${e}`));
        }
      }
    });
  };

  const isOverflown = (element) => {
    const { classList } = element;
    return classList.contains('overflow-auto') || classList.contains('overflow-auto-x') || classList.contains('overflow-auto-y');
  };

  const dragScroll = (e) => {
    // const touch = e.targetTouches[0];
    const scrollZonePx = 25;
    const elemsBelow = document.elementsFromPoint(e.clientX, e.clientY);

    // TODO Исправить баг: если при портретной ориентации завести draggable элемент за правый край, то при перетаскивании вправо будет происходить скрол вверх (без срабатывания логики ниже). WTF???!!
    if (
      window.scrollY + coordinates.clientHeight < coordinates.pageHeight
      && e.clientY >= (coordinates.clientHeight - scrollZonePx)
      && e.pageY <= coordinates.pageHeight
    ) {
      // page down
      window.scrollBy(0, (e.clientY - (coordinates.clientHeight - scrollZonePx)) * 2);
    } else if (window.scrollY > 0 && e.clientY <= scrollZonePx && e.pageY >= 0) {
      // page up
      window.scrollBy(0, -Math.abs(scrollZonePx - Math.abs(e.clientY)) * 2);
    } else if (
      window.scrollX + coordinates.clientWidth < coordinates.pageWidth
      && e.clientX >= (coordinates.clientWidth - scrollZonePx)
      && e.clientX <= coordinates.pageWidth
    ) {
      // page right
      window.scrollBy((e.clientX - (coordinates.clientWidth - scrollZonePx)) * 2, 0);
    } else if (window.scrollX > 0 && e.clientX <= scrollZonePx && e.pageX >= 0) {
      // page left
      window.scrollBy(-Math.abs(scrollZonePx - Math.abs(e.clientX)) * 2, 0);
    } else if (elemsBelow) {
      const cloneIndex = elemsBelow.findIndex(elem => elem.id === `clone-${uuid}`);
      elemsBelow.splice(0, cloneIndex + 1);

      elemsBelow.some(elem => {
        if (isOverflown(elem)) {
          const elemBox = elem.getBoundingClientRect();
          // overflown element up
          if (e.clientY <= elemBox.top + scrollZonePx && e.clientY > elemBox.top && e.pageY >= 0) {
            elem.scrollBy(0, -Math.abs(elemBox.top + scrollZonePx - Math.abs(e.clientY)) * 2);
          }
          // overflown element down
          if (e.clientY >= elemBox.bottom - scrollZonePx && e.clientY <= elemBox.bottom && e.pageY <= coordinates.pageHeight) {
            elem.scrollBy(0, (e.clientY - (elemBox.bottom - scrollZonePx)) * 2);
          }
          // overflown element left
          if (e.clientX <= elemBox.left + scrollZonePx && e.clientX > elemBox.left && e.pageX >= 0) {
            elem.scrollBy(-Math.abs(elemBox.left + scrollZonePx - e.clientX) * 2, 0);
          }
          // overflown element right
          if (e.clientX >= elemBox.right - scrollZonePx && e.clientX <= elemBox.right && e.pageX <= coordinates.pageWidth) {
            elem.scrollBy((e.clientX - (elemBox.right - scrollZonePx)) * 2, 0);
          }
          return true;
        }
        return false;
      });
    }
  };

  const handleMouseUp = (e) => {
    if (e.cancelable) { e.preventDefault(); }
    clearState();

    onMouseUp(e);
    onDragEnd(e);
  };

  const handleDrag = (e, touch) => {
    if (!isMouseDown) { return; }
    if (e.cancelable) { e.preventDefault(); }

    const click = touch || e;
    const cloneStyle = draggableClone.style;

    cloneStyle.position = 'absolute';
    cloneStyle.left = `${click.pageX - coordinates.leftCorrection}px`;
    cloneStyle.top = `${click.pageY - coordinates.topCorrection}px`;
  };

  const handleDragEnd = (e, touch) => {
    clearState();
    const click = touch || e;

    if (!e.target.matches('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')) {
      if (e.cancelable) { e.preventDefault(); }
      const elemBelow = document.elementFromPoint(click.clientX, click.clientY);

      if (elemBelow?.classList.contains('droppable')) {
        const event = new Event(`custom-event-${elemBelow.id.substring(10)}`);
        elemBelow.dispatchEvent(event);
      }
    }

    onMouseUp(e);
    onDragEnd(e);
  };

  const cloneElem = (elem, clickEvent) => {
    const { documentElement } = document;
    draggableClone = elem.cloneNode(true);
    const cloneStyle = draggableClone.style;
    const box = elem.getBoundingClientRect();

    coordinates.leftCorrection = clickEvent.clientX - box.left;
    coordinates.topCorrection = clickEvent.clientY - box.top;

    draggableClone.id = `clone-${uuid}`;
    draggableClone.onmouseup = handleDragEnd;

    copyComputedStyle(elem, draggableClone);

    cloneStyle.position = 'absolute';
    cloneStyle.zIndex = 1020;
    cloneStyle.opacity = 0.5;
    cloneStyle.left = `${clickEvent.pageX - coordinates.leftCorrection}px`;
    cloneStyle.top = `${clickEvent.pageY - coordinates.topCorrection}px`;

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
  };

  const handleMouseDown = (e, touch) => {
    const draggable = e.currentTarget;
    const click = touch || e;

    if (!draggableClone) { cloneElem(draggable, click); }
    dragScroll(click);

    onMouseDown(e);
    isMouseDown = true;
  };

  const handleTouchStart = (e) => { handleMouseDown(e, e.changedTouches[0]); };
  const handleTouchMove = (e) => { handleDrag(e, e.changedTouches[0]); };
  const handleTouchEnd = (e) => { handleDragEnd(e, e.changedTouches[0]); };
  const handleTouchCancel = (e) => { handleMouseUp(e); };

  useEffect(() => {
    const draggable = document.getElementById(`draggable-${uuid}`);
    draggable.addEventListener('touchstart', handleTouchStart);
    draggable.addEventListener('touchmove', handleTouchMove);
    draggable.addEventListener('touchend', handleTouchEnd);
    draggable.addEventListener('touchcancel', handleTouchCancel);
    document.addEventListener('mousemove', handleDrag);

    return () => {
      draggable.removeEventListener('touchstart', handleTouchStart);
      draggable.removeEventListener('touchmove', handleTouchMove);
      draggable.removeEventListener('touchend', handleTouchEnd);
      draggable.removeEventListener('touchcancel', handleTouchCancel);
      document.removeEventListener('mousemove', handleDrag);
    };
  });

  return (
    <div
      className="draggable p-2 m-2"
      draggable="true"
      id={`draggable-${uuid}`}
      onMouseDown={handleMouseDown}
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
