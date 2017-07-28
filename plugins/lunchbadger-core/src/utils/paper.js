import 'jsplumb';

const jsPlumbConfig = {
  DragOptions: {
    cursor: 'pointer',
    zIndex: 2000,
  },
  ReattachConnections: true,
  PaintStyle: {
    strokeStyle: '#ffffff',
    lineWidth: 6,
  },
  Connector: [
    'Flowchart',
    {
      cornerRadius: 15,
    },
  ],
  Container: 'canvas',
  ConnectionOverlays: [
    [
      'Label',
      {
        label: 'X',
        id: 'remove-button',
        cssClass: 'remove-button',
      },
    ],
  ],
  Anchors: [
    0.5,
    0,
    0.5,
    0.5,
  ],
};

const connectionTypes = {
  wip: {
    cssClass: 'loading',
    detachable: false,
  },
};

const instance = jsPlumb.getInstance(jsPlumbConfig);
instance.registerConnectionTypes(connectionTypes);

export default instance;
