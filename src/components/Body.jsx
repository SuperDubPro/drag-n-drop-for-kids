import DATA from '../project-config';
import Draggable from './Draggable';

function Body() {
  const { scheme } = DATA;

  return (
    <div className="body">
      Hi!
      <div className="drag-list">
        {scheme.map(text => <Draggable text={text} key={`draggable-${text}`} />)}
      </div>
    </div>
  );
}

export default Body;
