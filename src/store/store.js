// store/store.js
const files = import.meta.globEager("./modules/*.js");
const modules = {};

Object.keys(files).forEach((key) => {
  const filename = key.replace(/(\.\/|modules\/|\.(js|ts))/g, "");
  modules[filename] = files[key].default;
});

export default modules;
