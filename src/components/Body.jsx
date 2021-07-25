import { v1 as genUuid } from 'uuid';
import DATA from '../project-config';
import Draggable from './Draggable';
import Droppable from './Droppable';

function Body() {
  const { scheme } = DATA;
  const mScheme = new Map();

  scheme.forEach(text => {
    mScheme.set(genUuid(), text);
  });

  return (
    <div className="body">
      <div className="drop-list">
        {Array.from(mScheme).map(([uuid, text]) => (
          <Droppable
            uuid={uuid}
            key={`droppable-component-${uuid}`}
            text={text}
            onDrop={(e) => console.log(e, uuid)}
          />
        ))}
      </div>

      <div className="drag-list">
        {Array.from(mScheme).map(([uuid, text]) => (
          <Draggable
            uuid={uuid}
            key={`draggable-component-${uuid}`}
            text={text}
          />
        ))}
      </div>
    </div>
  );
}

export default Body;
