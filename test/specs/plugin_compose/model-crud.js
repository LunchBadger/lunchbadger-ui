var page;
var modelSelector1;
var modelSelector2;

module.exports = {
  '@disabled': true,
  'Model CRUD: create models': function (browser) {
    page = browser.page.lunchBadger();
    modelSelector1 = page.getModelSelector(1);
    modelSelector2 = page.getModelSelector(2);
    page
      .open()
      .checkEntities()
      .addElement('model')
      .setCanvasEntityName(modelSelector1, 'Car')
      .submitCanvasEntity(modelSelector1)
      .addElement('model')
      .setCanvasEntityName(modelSelector2, 'Driver')
      .submitCanvasEntity(modelSelector2)
      .reloadPage()
      .checkEntities('', 'Car,Driver');
  },
  'Model CRUD: context path pristine': function () {
    page
      .editEntity(modelSelector1)
      .setCanvasEntityName(modelSelector1, 'Car1')
      .submitCanvasEntity(modelSelector1)
      .reloadPage()
      .checkEntities('', 'Car1,Driver');
  },
  'Model CRUD: context path dirty': function () {
    page
      .editEntity(modelSelector1)
      .setField(modelSelector1, 'httppath', 'car12')
      .submitCanvasEntity(modelSelector1)
      .reloadPage()
      .checkEntities('', 'Car1,Driver', 'car12,driver');
  },
  'Model CRUD: discard changes': function () {
    page
      .editEntity(modelSelector1)
      .setCanvasEntityName(modelSelector1, 'Bus')
      .setField(modelSelector1, 'httppath', 'bus')
      .discardCanvasEntityChanges(modelSelector1)
      .checkEntities('', 'Car1,Driver', 'car12,driver');
  },
  'Model CRUD: add properties': function () {
    page
      .editEntity(modelSelector1)
      .addModelPropertyOnCanvas(modelSelector1, 0)
      .setModelPropertyOnCanvas(modelSelector1, 0, 'color')
      .addModelPropertyOnCanvas(modelSelector1, 1)
      .setModelPropertyOnCanvas(modelSelector1, 1, 'engine')
      .submitCanvasEntity(modelSelector1)
      .reloadPage()
      .checkEntities('', 'Car1,Driver', 'car12,driver')
      .checkModelProperties(modelSelector1, 'color,engine', 'String,String');
  },
  'Model CRUD: change properties': function () {
    page
      .editEntity(modelSelector1)
      .setModelPropertyOnCanvas(modelSelector1, 0, 'manual')
      .setModelPropertyTypeOnCanvas(modelSelector1, 0, 'Boolean')
      .setModelPropertyOnCanvas(modelSelector1, 1, 'windows')
      .setModelPropertyTypeOnCanvas(modelSelector1, 1, 'Number')
      .submitCanvasEntity(modelSelector1)
      .reloadPage()
      .checkEntities('', 'Car1,Driver', 'car12,driver')
      .checkModelProperties(modelSelector1, 'manual,windows', 'Boolean,Number');
  },
  'Model CRUD: change properties options': function () {
    page
      .openEntityInDetailsPanel(modelSelector1)
      .setField('.DetailsPanel', 'httppath', 'car')
      .setField('.DetailsPanel', 'plural', 'cars')
      .selectValueSlow('.DetailsPanel', 'base', 'Model')
      .setField('.DetailsPanel', 'properties0default_', 'true')
      .setField('.DetailsPanel', 'properties0description', 'notes manual')
      .setField('.DetailsPanel', 'properties1default_', '6')
      .setField('.DetailsPanel', 'properties1description', 'notes windows')
      .clickPresent('.DetailsPanel .checkbox__properties0required')
      .clickPresent('.DetailsPanel .checkbox__properties0index')
      .clickPresent('.DetailsPanel .checkbox__properties1required')
      .clickPresent('.DetailsPanel .checkbox__properties1index')
      .submitDetailsPanelWithCloseBeforeWip(modelSelector1)
      .checkEntities('', 'Car1,Driver', 'car,driver')
      .checkModelProperties(modelSelector1, 'manual,windows', 'Boolean,Number')
      .reloadPage()
      .checkEntities('', 'Car1,Driver', 'car,driver')
      .checkModelProperties(modelSelector1, 'manual,windows', 'Boolean,Number')
      .openEntityInDetailsPanel(modelSelector1)
      .checkModelDetails('Car1', 'car', 'cars', 'Model')
      .checkModelDetailsProperties('manual,windows', 'Boolean,Number', 'true,6', 'notes manual,notes windows', 'checked,checked', 'checked,checked')
      .checkModelDetailsRelations()
      .checkModelDetailsUDF();
  },
  'Model CRUD: discard properties change': function () {
    page
      .setField('.DetailsPanel', 'httppath', 'bus')
      .clickPresent('.DetailsPanel .button__remove__property0')
      .clickPresent('.DetailsPanel .button__add__property')
      .setField('.DetailsPanel', 'properties1name', 'temp')
      .checkModelDetails('Car1', 'bus', 'cars', 'Model')
      .checkModelDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked')
      .discardDetailsPanelChanges(modelSelector1)
      .checkModelDetails('Car1', 'car', 'cars', 'Model')
      .checkModelDetailsProperties('manual,windows', 'Boolean,Number', 'true,6', 'notes manual,notes windows', 'checked,checked', 'checked,checked')
  },
  'Model CRUD: confirm properties change': function () {
    page
      .setField('.DetailsPanel', 'httppath', 'bus')
      .clickPresent('.DetailsPanel .button__remove__property0')
      .clickPresent('.DetailsPanel .button__add__property')
      .setField('.DetailsPanel', 'properties1name', 'temp')
      .checkModelDetails('Car1', 'bus', 'cars', 'Model')
      .checkModelDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked')
      .confirmDetailsPanelChanges(modelSelector1)
      .reloadPage()
      .checkEntities('', 'Car1,Driver', 'bus,driver')
      .checkModelProperties(modelSelector1, 'windows,temp', 'Number,String')
      .openEntityInDetailsPanel(modelSelector1)
      .checkModelDetails('Car1', 'bus', 'cars', 'Model')
      .checkModelDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked')
      .checkModelDetailsRelations()
      .checkModelDetailsUDF();
  },
  'Model CRUD: add UDFs': function () {
    page
      .clickPresent('.button__add__udf')
      .setField('.DetailsPanel', 'userFields0name', 'field1')
      .setField('.DetailsPanel', 'userFields0value', 'value1')
      .clickPresent('.DetailsPanel .button__add__udf')
      .setField('.DetailsPanel', 'userFields1name', 'field2')
      .selectValueSlow('.DetailsPanel', 'userFields1type', 'Number')
      .setField('.DetailsPanel', 'userFields1value', 12, 'number')
      .clickPresent('.DetailsPanel .button__add__udf')
      .setField('.DetailsPanel', 'userFields2name', 'field3')
      .selectValueSlow('.DetailsPanel', 'userFields2type', 'Object')
      .setValueSlow('.DetailsPanel .input__userFields2value textarea:nth-child(2)', '{"abc": 234}');
  },
  'Model CRUD: add relations': function () {
    page
      .clickPresent('.DetailsPanel .button__add__relation')
      .setField('.DetailsPanel', 'relations0name', 'relation1')
      .setField('.DetailsPanel', 'relations0foreignKey', 'driver1')
      .selectValueSlow('.DetailsPanel', 'relations0type', 'hasMany')
      .pause(1500)
      .selectValueSlow('.DetailsPanel', 'relations0model', 'Driver')
      .pause(1500)
      .clickPresent('.DetailsPanel .button__add__relation')
      .setField('.DetailsPanel', 'relations1name', 'relation2')
      .setField('.DetailsPanel', 'relations1foreignKey', 'bus1')
      .selectValueSlow('.DetailsPanel', 'relations1type', 'belongsTo')
      .pause(1500)
      .selectValueSlow('.DetailsPanel', 'relations1model', 'Car1')
      .pause(1500)
      .clickPresent('.DetailsPanel .button__add__relation')
      .setField('.DetailsPanel', 'relations2name', 'relation3')
      .setField('.DetailsPanel', 'relations2foreignKey', 'bus2')
      .selectValueSlow('.DetailsPanel', 'relations2type', 'hasAndBelongsToMany')
      .pause(1500)
      .selectValueSlow('.DetailsPanel', 'relations2model', 'Car1')
      .pause(1500)
      .submitDetailsPanelWithCloseBeforeWip(modelSelector1)
      .reloadPage()
      .checkEntities('', 'Car1,Driver', 'bus,driver')
      .checkModelProperties(modelSelector1, 'windows,temp', 'Number,String')
      .openEntityInDetailsPanel(modelSelector1)
      .checkModelDetails('Car1', 'bus', 'cars', 'Model')
      .checkModelDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked')
      .checkModelDetailsUDF('field1,field2,field3', 'String,Number,Object', 'value1,12,')
      .checkModelDetailsRelations('relation1,relation2,relation3', 'hasMany,belongsTo,hasAndBelongsToMany', 'Driver,Car1,Car1', 'driver1,bus1,bus2');
  },
  'Model CRUD: discard remove UDFs and relations': function () {
    page
      .clickPresent('.DetailsPanel .button__remove__udf0')
      .clickPresent('.DetailsPanel .button__remove__relation0')
      .notPresent('.DetailsPanel .input__userFields2name', 5000)
      .notPresent('.DetailsPanel .input__relations2name', 5000)
      .checkModelDetailsUDF('field2,field3', 'Number,Object', '12,')
      .checkModelDetailsRelations('relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Car1,Car1', 'bus1,bus2')
      .discardDetailsPanelChanges(modelSelector1)
      .checkModelDetails('Car1', 'bus', 'cars', 'Model')
      .checkModelDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked')
      .checkModelDetailsUDF('field1,field2,field3', 'String,Number,Object', 'value1,12,')
      .checkModelDetailsRelations('relation1,relation2,relation3', 'hasMany,belongsTo,hasAndBelongsToMany', 'Driver,Car1,Car1', 'driver1,bus1,bus2');
  },
  'Model CRUD: confirm remove UDFs and relations': function () {
    page
      .clickPresent('.DetailsPanel .button__remove__udf0')
      .clickPresent('.DetailsPanel .button__remove__relation0')
      .notPresent('.DetailsPanel .input__userFields2name', 5000)
      .notPresent('.DetailsPanel .input__relations2name', 5000)
      .checkModelDetailsUDF('field2,field3', 'Number,Object', '12,')
      .checkModelDetailsRelations('relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Car1,Car1', 'bus1,bus2')
      .confirmDetailsPanelChanges(modelSelector1)
      .checkModelDetailsUDF('field2,field3', 'Number,Object', '12,')
      .checkModelDetailsRelations('relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Car1,Car1', 'bus1,bus2')
      .reloadPage()
      .checkEntities('', 'Car1,Driver', 'bus,driver')
      .checkModelProperties(modelSelector1, 'windows,temp', 'Number,String')
      .openEntityInDetailsPanel(modelSelector1)
      .checkModelDetails('Car1', 'bus', 'cars', 'Model')
      .checkModelDetailsProperties('windows,temp', 'Number,String', '6,', 'notes windows,', 'checked,unchecked', 'checked,unchecked')
      .checkModelDetailsUDF('field2,field3', 'Number,Object', '12,')
      .checkModelDetailsRelations('relation2,relation3', 'belongsTo,hasAndBelongsToMany', 'Car1,Car1', 'bus1,bus2')
      .closeDetailsPanel()
      .close();
  }
};
