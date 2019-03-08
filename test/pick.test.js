// const { expect } = require('chai');
// const { pick } = require('../lib/helpers/obj-utils');

// const OBJECT = Object.freeze({
//   a: 1,
//   b: 2,
//   c: { z: 10 },
//   d: [1, 2, 3],
// });

// describe('When calling pick()', () => {
//   describe('With an object and keys', () => {
//     const myObj = { ...OBJECT };

//     before(() => {
//       this.newObj = pick(myObj, ['a', 'c', 'd']);
//     });

//     it('Should return an object with the picked keys', () => {
//       expect(this.newObj).to.eql({
//         a: 1,
//         c: { z: 10 },
//         d: [1, 2, 3],
//       });
//     });

//     it('Should not mutate the original object', () => {
//       expect(myObj).to.eql(OBJECT);
//     });
//   });

//   describe('With an empty array', () => {
//     it('Should return the same object', () => {
//       const myObj = { ...OBJECT };

//       expect(pick(myObj, [])).to.eql(OBJECT);
//     });
//   });

//   describe('With an undefined array', () => {
//     it('Should return the same object', () => {
//       const myObj = { ...OBJECT };

//       expect(pick(myObj)).to.eql(OBJECT);
//     });
//   });

//   describe('With a string instead of an array of keys', () => {
//     it('Should return the same object', () => {
//       const myObj = { ...OBJECT };

//       expect(pick(myObj, 'str')).to.eql(OBJECT);
//     });
//   });

//   describe('With an empty object', () => {
//     it('Should return the same object', () => {
//       const myObj = {};

//       expect(pick(myObj, ['a', 'b'])).to.eql({});
//     });
//   });

//   describe('With a string instead of an object', () => {
//     it('Should return the same string', () => {
//       const myObj = 'str';

//       expect(pick(myObj, ['a', 'b'])).to.eql('str');
//     });
//   });
// });
