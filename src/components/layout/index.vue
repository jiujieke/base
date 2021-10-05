<template>
  <div class="app-container">
    <a-layout id="layout" :style="{ 'min-height': '100vh', 'padding-left': isCollapse ? '48px' : '208px' }">
      <layout-sider />
      <a-layout>
        <layout-header />
        <a-layout-content id="ifly-content">
            <div id="test-content" class="content">
                <router-view></router-view>
            </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import { AppState } from '@/store/modules/app';
import Header from '@/components/common/header.vue';
import Sider from '@/components/common/sider.vue';

@Component({
    components: {
        'layout-header': Header,
        'layout-sider': Sider,
    },
})
export default class Layout extends Vue {
    get isCollapse() {
        return AppState.isCollapse;
    }
}
</script>
<style lang="less" scoped>
.app-container {
    position: relative;
    min-width: 760px;
    section.ant-layout {
        width: 100%;
        min-height: 100vh;
    }
}
#layout {
    -webkit-transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}
#ifly-content {
    box-sizing: border-box;
    padding: 0 16px;
}
.content {
    position: relative;
    left: 0;
    margin: 16px 0;
    transition: all 200ms ease 0s;
    background: #fff;
    // min-height: calc(100% - 32px);
    .nav {
        width: 200px;
        background-color: #fff;

        .title {
            font-size: 20px;
            color: @text-color;
            padding-top: 32px;
            padding-bottom: 24px;
            padding-left: 24px;
        }

        ul {
            list-style-type: none;
            padding-left: 36px;

            li {
                width: 100%;
                height: 36px;
                line-height: 36px;
                font-size: 14px;
            }
        }
    }
}
</style>