/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

 module.exports = {
  getTransformModulePath() {
    return require.resolve("react-native-svg-transformer");
  },
  getSourceExts() {
    return ["js", "jsx", "svgx"];
  }
};