<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" v-wechat-title="$route.meta.title || description" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" v-wechat-title="$route.meta.title || description" />
  </div>
</template>
<script>
import pkg from "~/package.json";
export default {
  data() {
    return {
      description: pkg.description || "",
    };
  },
};
</script>
<style lang="scss"></style>
