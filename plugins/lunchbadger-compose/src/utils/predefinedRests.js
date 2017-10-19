export const predefinedOperation = {
  template: {
    method: 'GET',
    url: '',
    responsePath: '',
    headers: {
    },
    query: {
    },
  },
  functions: {
  },
};

export default {
  custom: {
    label: 'Custom',
    operations: [predefinedOperation],
  },
  'google-maps-geocode': {
    label: 'Google Maps - GeoCode',
    operations: [{
      template: {
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        headers: {
          accepts: 'application/json',
          'content-type': 'application/json',
        },
        query: {
          key: '',
          address: '{street},{city},{zipcode}',
          sensor: '{sensor=false}',
        },
        responsePath: '$.results[0].geometry.location',
      },
      functions: {
        geocode: ['street', 'city', 'zipcode'],
      },
    }],
  },
  'google-maps-location': {
    label: 'Google Maps - Location',
    operations: [{
      template: {
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        headers: {
          accepts: 'application/json',
          'content-type': 'application/json',
        },
        query: {
          key: '',
          latlng: '{lat},{long}',
        },
        responsePath: '$.results[0].formatted_address',
      },
      functions: {
        location: ['lat', 'long'],
      },
    }],
  },
};
