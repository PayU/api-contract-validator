module.exports = [
  {
    dataPath: ".headers['x-request-id']",
    keyword: 'minLength',
    message: 'should NOT be shorter than 4 characters',
    params: {
      limit: 4,
    },
    schemaPath: '#/properties/headers/properties/x-request-id/minLength',
  },
  {
    dataPath: '.headers',
    keyword: 'required',
    message: "should have required property 'x-elapsed-time'",
    params: {
      missingProperty: 'x-elapsed-time',
    },
    schemaPath: '#/properties/headers/required',
  },
  {
    dataPath: '.body',
    keyword: 'required',
    message: "should have required property 'name'",
    params: {
      missingProperty: 'name',
    },
    schemaPath: '#/properties/body/required',
  },
  {
    dataPath: '.body.age',
    keyword: 'minimum',
    message: 'should be >= 0',
    params: {
      comparison: '>=',
      exclusive: false,
      limit: 0,
    },
    schemaPath: '#/properties/body/properties/age/minimum',
  },
  {
    dataPath: '.body.details',
    keyword: 'required',
    message: "should have required property 'location'",
    params: {
      missingProperty: 'location',
    },
    schemaPath: '#/properties/body/properties/details/required',
  },
  {
    dataPath: '.body.details.food',
    keyword: 'minLength',
    message: 'should NOT be shorter than 4 characters',
    params: {
      limit: 4,
    },
    schemaPath: '#/properties/body/properties/details/properties/food/minLength',
  },
];
