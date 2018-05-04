export default {
  '011': {
    title: 'Data Source Dropdown Menu',
    text: 'Selecting this icon will reveal available data source connectors for your LunchBadger project.',
    selector: '.Tool.dataSource',
    position: 'right',
    onAfter: cb => {
      document.querySelector('.Tool.dataSource .Tool__box').click();
      setTimeout(cb, 500);
    },
  },
  '012': {
    title: 'Data Source Entities Overview',
    text: 'Each data source entity will come with its own set of properties specific for that type of connection.  These entities correspond with a matching data source connector that can be used with your underlying Loopback project.',
    selector: 'div[role=presentation]',
    position: 'right',
    onAfter: cb => {
      document.querySelector('.logotype').click();
      cb();
    },
  },
  '02': {
    title: 'Model Entities',
    text: 'Model Entity represent a visual interface on top of a Loopback Model. Here, you can add properties you\'d like to expose from your Data Source through your API Endpoint.',
    selector: '.Entity.Model',
    position: 'right',
  },
  '031': {
    title: 'Function Entities',
    text: 'A function entity represents a serverless function that runs in your Kubernetes cluster.',
    selector: '.Entity.Function_',
    position: 'right',
    onAfter: cb => {
      document.querySelector('.Entity.Function_').click();
      setTimeout(() => {
        document.querySelector('.Entity.Function_ .Toolbox__button--zoom').click();
        setTimeout(() => {
          document.querySelector('.DetailsPanel .FilesEditor__tree > div > div > .children > div:nth-child(2) > div > div').click();
          setTimeout(cb, 200);
        }, 1000);
      }, 200);
    },
  },
  '032': {
    text: 'LunchBadger includes a built-in editor.',
    selector: '.DetailsPanel .FilesEditor',
    position: 'top',
    onAfter: cb => {
      document.querySelector('.DetailsPanel .cancel').click();
      setTimeout(cb, 1000);
    },
  },
  '04': {
    title: 'Microservice Entities',
    text: '<i>This Entity is still in-development. It\'s not recommended for use at this time.</i>',
    selector: '.Tool.microservice',
    position: 'right',
  },
};
