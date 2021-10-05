<template>
    <a-config-provider :locale="locale">
        <div id="app">
            <router-view></router-view>
        </div>
    </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';

@Component
export default class App extends Vue {
    locale = zh_CN;
}
</script>

<style lang="less">
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: PingFangSC-Regular;
}
#app{
    height: 100%;
}
</style>
