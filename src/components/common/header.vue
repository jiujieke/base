<template>
    <a-layout-header class="header" style="background: #fff; padding: 0">
      <div class="header-left">{{ title }}</div>
      <div class="header-right">
          <div class="helper" @click="toHelp">
              <span>帮助中心</span>
          </div>
          <img :src="avatar" class="person-img" />
          <a-dropdown>
              <a-menu slot="overlay">
                  <a-menu-item key="1">
                      <div class="state" @click="XXXXX">XXXXX
                      </div>
                  </a-menu-item>
                  <a-menu-item key="2" @click.native.prevent="logout">
                      退出账号
                  </a-menu-item>
              </a-menu>
              <div class="name">
                  {{ name }}
                  <a-icon type="caret-down" />
              </div>
          </a-dropdown>
      </div>
    </a-layout-header>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import avatar from '@/assets/avatar.png'

@Component
export default class LayoutHeader extends Vue {
  title = 'PG.Ltd（企业账户名）';
  name = '管理员名称';
  avatar = avatar
  
  toHelp() {
    alert('前往帮助中心')
      // this.$router.push('/helpCenter');
  }

  XXXXX(){
    console.log('XXXXX')
  }
  
  logout() {
    alert('退出账号')
  }
}
</script>

<style lang="less" scoped>

.header {
    position: sticky;
    top: 0;
    z-index: 4;
    flex: 0 0 48px;
    height: 48px;
    background-color: @primary-color; // background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 29px;
    padding-left: 16px;
    box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.08);
    .header-left {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: @text-color;
        margin-left: 30px;
    }
    .header-right {
        display: flex;
        align-items: center;
        cursor: pointer;

        .person-img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
            vertical-align: middle;
        }
        .helper {
            position: relative;
            margin-right: 16px;

            .active {
                color: @primary-color;
            }
        }
        .name{
            margin-right: 20px;
        }
    }
}
</style>