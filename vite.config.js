import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
// import styleImport, { VantResolve } from "vite-plugin-style-import";
import { minifyHtml, injectHtml } from "vite-plugin-html";
import { viteExternalsPlugin } from "vite-plugin-externals";

// https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
function getIPAddress() {
  var interfaces = require("os").networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        return alias.address;
      }
    }
  }
  return "0.0.0.0";
}

// 打包排除某些依赖
const externals = {
  vue: "Vue",
  vuex: "Vuex",
  "vue-router": "VueRouter",
  axios: "axios",
  vant: "vant",
};

// cdn配置
function CDNAssets(mode) {
  const cdn = {
    // 开发环境
    development: [
      { href: "https://cdn.jsdelivr.net/npm/vant@2.12/lib/index.css", tag: "link" },
      { src: "https://cdn.jsdelivr.net/npm/eruda@2.4/eruda.min.js", tag: "script" },
    ],
    // 生产环境
    production: [
      { href: "https://cdn.jsdelivr.net/npm/vant@2.12/lib/index.css", tag: "link" },
      { src: "https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js", tag: "script" },
      { src: "https://cdn.jsdelivr.net/npm/vuex@3.6/dist/vuex.min.js", tag: "script" },
      { src: "https://cdn.jsdelivr.net/npm/vue-router@3.5/dist/vue-router.min.js", tag: "script" },
      { src: "https://cdn.jsdelivr.net/npm/axios@0.24/dist/axios.min.js", tag: "script" },
      { src: "https://cdn.jsdelivr.net/npm/vant@2.12/lib/vant.min.js", tag: "script" },
    ],
  };
  return cdn[mode].map((e) => ({
    tag: e.tag,
    attrs: e.tag === "link" ? { rel: "stylesheet", href: e.href } : { src: e.src },
    injectTo: e.tag === "link" ? "head" : "body",
  }));
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 获取环境变量
  const env = loadEnv(mode, process.cwd());
  return {
    base: mode === "production" ? "./" : "/",
    // 自定义环境变量前缀
    envPrefix: ["VITE_", "BN_"],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "~": resolve(__dirname, ""),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/index.scss";`,
          charset: false,
        },
      },
    },
    plugins: [
      createVuePlugin(),
      // styleImport({
      //   resolves:[VantResolve()],
      //   libs: [
      //     {
      //       libraryName: "vant",
      //       esModule: true,
      //       resolveStyle: (name) => {
      //         return `/node_modules/vant/es/${name}/style`;
      //       },
      //     },
      //   ],
      // }),
      minifyHtml(),
      injectHtml({
        tags: CDNAssets(mode),
      }),
      viteExternalsPlugin(mode === "production" ? externals : {}),
    ],
    build: {
      outDir: env.VITE_OUTPUT_DIR,
      // https://cn.vitejs.dev/config/#build-minify
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    server: {
      host: getIPAddress(),
      port: 8080,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
