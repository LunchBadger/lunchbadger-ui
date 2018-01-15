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
      stub: 7,
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

class Paper {

  initialize = () => {
    this.instance = jsPlumb.getInstance(jsPlumbConfig);
    this.instance.registerConnectionTypes(connectionTypes);
    this.repaintInternal = setInterval(this.repaint, 50);
    return this.instance;
  }

  getInstance = () => this.instance;

  repaint = () => this.instance.repaintEverything();

  stopRepaintingEverything = () => {
    clearInterval(this.repaintInternal);
    this.instance = null;
  }

}

export default new Paper();
