import APIForecast from 'models/APIForecast';
import ForecastAPI from 'models/ForecastAPI';
import uuid from 'uuid';
import {expect} from 'chai';

const {API} = LunchBadgerMonetize.models;

describe('APIForecast Model', () => {
  it('should serialize APIForecast to JSON', () => {
    const api = ForecastAPI.create({});
    const forecast = APIForecast.create({
      api: api,
      id: uuid.v4()
    });

    const serializedForecast = forecast.toJSON();

    expect(serializedForecast.id).to.equal(forecast.id);
  });

  it('should create ForecastAPI instance from API model', () => {
    const api = API.create({});
    const forecast = APIForecast.create({
      api: api
    });

    expect(forecast.api.constructor.type).to.equal(ForecastAPI.type);
  });
});
