// import {addDataSource, addModel} from '../reduxActions';
import AddAPI from '../actions/CanvasElements/API/add';
import AddPortal from '../actions/CanvasElements/Portal/add';

export default {
  2: [
    {
      icon: 'iconApi',
      tooltip: 'API',
      action: () => AddAPI(),
    },
    {
      icon: 'iconPortal',
      tooltip: 'Portal',
      action: () => AddPortal(),
    },
  ],
};
