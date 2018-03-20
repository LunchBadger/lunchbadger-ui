var page;
var dataSourceSelector1;
var dataSourceSelector2;
var modelSelector1;
var modelSelector2;

module.exports = {
  '@disabled': true,
  'CRUD on details panel: create datasources': function (browser) {
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
      .checkEntities('Memory1')
      .addElementFromTooltip('dataSource', 'memory')
      .setCanvasEntityName(dataSourceSelector2, 'Memory2')
      .submitCanvasEntity(dataSourceSelector2)
      .reloadPage()
      .checkEntities('Memory1,Memory2');
  },
  'CRUD on details panel: create models': function () {
    page
      .addElement('model')
      .setCanvasEntityName(modelSelector1, 'Car')
      .submitCanvasEntity(modelSelector1)
      .addElement('model')
      .setCanvasEntityName(modelSelector2, 'Driver')
      .submitCanvasEntity(modelSelector2)
      .reloadPage()
      .checkEntities('Memory1,Memory2', 'Car,Driver');
  },
  'CRUD on details panel: connect datasource with model': function () {
    page
      .openEntityInDetailsPanel(modelSelector1)
      .selectValueSlow('.DetailsPanel', 'dataSource', 'Memory1')
      .submitDetailsPanel(modelSelector1)
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
  'CRUD on details panel: rename datasource and model': function () {
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
      .checkEntities('Memory1New,Memory2', 'Car1,Driver', 'car1,driver')
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
  'CRUD on details panel: reattach connection between datasources': function () {
    page
      .openEntityInDetailsPanel(modelSelector1)
      .selectValueSlow('.DetailsPanel', 'dataSource', 'Memory2')
      .submitDetailsPanel(modelSelector1)
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
      .checkEntities('Memory1New,Memory2', 'Car1,Driver', 'car1,driver')
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
  'CRUD on details panel: reattach connection between models': function () {
    page
      .openEntityInDetailsPanel(modelSelector1)
      .selectValueSlow('.DetailsPanel', 'dataSource', 'None')
      .submitDetailsPanel(modelSelector1)
      .openEntityInDetailsPanel(modelSelector2)
      .selectValueSlow('.DetailsPanel', 'dataSource', 'Memory2')
      .submitDetailsPanel(modelSelector2)
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
      .checkEntities('Memory1New,Memory2', 'Car1,Driver', 'car1,driver')
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
      .close();
  }
};
