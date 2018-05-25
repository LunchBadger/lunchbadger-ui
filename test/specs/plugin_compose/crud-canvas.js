var page;
var dataSourceSelector1;
var dataSourceSelector2;
var modelSelector1;
var modelSelector2;

module.exports = {
  '@disabled': true, // FIXME enable when changing model/datasource name will be persisten server-side
  'CRUD on canvas: create datasource 1': function (browser) {
    page = browser.page.lunchBadger();
    dataSourceSelector1 = page.getDataSourceSelector(1);
    dataSourceSelector2 = page.getDataSourceSelector(2);
    modelSelector1 = page.getModelSelector(1);
    modelSelector2 = page.getModelSelector(2);
    page
      .open()
      .addElementFromTooltip('dataSource', 'memory')
      .setCanvasEntityName(dataSourceSelector1, 'Memory1')
      .submitCanvasEntity(dataSourceSelector1)
      .checkEntities('Memory1');
  },
  'CRUD on canvas: create datasource 2': function () {
    page
      .addElementFromTooltip('dataSource', 'memory')
      .setCanvasEntityName(dataSourceSelector2, 'Memory2')
      .submitCanvasEntity(dataSourceSelector2)
      .checkEntities('Memory1,Memory2');
  },
  'CRUD on canvas: create model 1': function () {
    page
      .addElement('model')
      .setCanvasEntityName(modelSelector1, 'Car')
      .submitCanvasEntity(modelSelector1)
      .checkEntities('Memory1,Memory2', 'Car')
  },
  'CRUD on canvas: create model 2': function () {
    page
      .addElement('model')
      .setCanvasEntityName(modelSelector2, 'Driver')
      .submitCanvasEntity(modelSelector2)
      .checkEntities('Memory1,Memory2', 'Car,Driver')
  },
  'CRUD on canvas: connect datasource with model': function () {
    page
      .connectPorts(dataSourceSelector1, 'out', modelSelector1, 'in')
      .check({
        connected: {
          [dataSourceSelector1]: ['out'],
          [modelSelector1]: ['in']
        },
        notConnected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector2]: ['in']
        }
      })
      .reloadPage()
      .checkEntities('Memory1,Memory2', 'Car,Driver')
      .check({
        connected: {
          [dataSourceSelector1]: ['out'],
          [modelSelector1]: ['in']
        },
        notConnected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector2]: ['in']
        }
      });
  },
  'CRUD on canvas: rename datasource and model': function () {
    page
      .editEntity(dataSourceSelector1)
      .setCanvasEntityName(dataSourceSelector1, 'Memory1New')
      .submitCanvasEntity(dataSourceSelector1)
      .editEntity(modelSelector1)
      .setCanvasEntityName(modelSelector1, 'Car1')
      .submitCanvasEntity(modelSelector1)
      .check({
        connected: {
          [dataSourceSelector1]: ['out'],
          [modelSelector1]: ['in']
        },
        notConnected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector2]: ['in']
        }
      })
      .reloadPage()
      .checkEntities('Memory1New,Memory2', 'Car1,Driver')
      .check({
        connected: {
          [dataSourceSelector1]: ['out'],
          [modelSelector1]: ['in']
        },
        notConnected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector2]: ['in']
        }
      });
  },
  'CRUD on canvas: reattach connection between datasources': function () {
    page
      .connectPorts(dataSourceSelector1, 'out', dataSourceSelector2, 'out', -1, true)
      .check({
        connected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector1]: ['in']
        },
        notConnected: {
          [dataSourceSelector1]: ['out'],
          [modelSelector2]: ['in']
        }
      })
      .reloadPage()
      .checkEntities('Memory1New,Memory2', 'Car1,Driver')
      .check({
        connected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector1]: ['in']
        },
        notConnected: {
          [dataSourceSelector1]: ['out'],
          [modelSelector2]: ['in']
        }
      });
  },
  'CRUD on canvas: reattach connection between models': function () {
    page
      .connectPorts(modelSelector1, 'in', modelSelector2, 'in', -1, true)
      .check({
        connected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector2]: ['in']
        },
        notConnected: {
          [dataSourceSelector1]: ['out'],
          [modelSelector1]: ['in']
        }
      })
      .reloadPage()
      .checkEntities('Memory1New,Memory2', 'Car1,Driver')
      .check({
        connected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector2]: ['in']
        },
        notConnected: {
          [dataSourceSelector1]: ['out'],
          [modelSelector1]: ['in']
        }
      });
  },
  'CRUD on canvas: remove connection on remove model': function () {
    page
      .removeEntity(modelSelector2)
      .check({
        notConnected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector2]: ['in'],
          [dataSourceSelector1]: ['out'],
          [modelSelector1]: ['in']
        }
      })
      .reloadPage()
      .checkEntities('Memory1New,Memory2', 'Car1')
      .check({
        notConnected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector2]: ['in'],
          [dataSourceSelector1]: ['out'],
          [modelSelector1]: ['in']
        }
      });
  },
  'CRUD on canvas: remove connection on remove datasource': function () {
    page
      .connectPorts(dataSourceSelector2, 'out', modelSelector1, 'in')
      .check({
        connected: {
          [dataSourceSelector2]: ['out'],
          [modelSelector1]: ['in']
        },
        notConnected: {
          [dataSourceSelector1]: ['out']
        }
      })
      .removeEntity(dataSourceSelector2)
      .check({
        notConnected: {
          [modelSelector1]: ['in'],
          [dataSourceSelector1]: ['out']
        }
      })
      .reloadPage()
      .checkEntities('Memory1New', 'Car1')
      .check({
        notConnected: {
          [modelSelector1]: ['in'],
          [dataSourceSelector1]: ['out']
        }
      })
      .close();
  }
};
