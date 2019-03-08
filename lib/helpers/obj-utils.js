// module.exports.pick = function only(obj, requiredKeys) {
//   if (
//     !Array.isArray(requiredKeys)
//     || requiredKeys.length === 0
//     || !(obj instanceof Object)
//     || Object.keys(obj).length === 0
//   ) {
//     return obj;
//   }

//   const objKeys = requiredKeys;
//   return requiredKeys.reduce((newObj, key) => {
//     if (objKeys.includes(key)) {
//       return {
//         ...newObj,
//         [key]: obj[key],
//       };
//     }
//     return newObj;
//   }, {});
// };
