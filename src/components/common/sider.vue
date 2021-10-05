<template>
    <a-layout-sider v-model="isCollapse" class="sidebar-container">
        <div :class="([isCollapse ? 'icon-sidebar' : ''], 'header-box')">
            <div class="sidebar-head" :style="{ 'padding-left': isCollapse ? '13px' : '13px' }">
                <img src="@/assets/aiyinLogo.png" class="head-icon-img" />
                <span v-if="!isCollapse" class="name">智能知识中台</span>
            </div>
        </div>
        <a-menu
            v-model="selectedKeys"
            mode="inline"
            class="sidebar"
            :inline-collapsed="isCollapse"
            :open-keys="openKeys"
            @openChange="onOpenChange"
            @select="onSelect"
        >
            <template v-for="item in menuList.filter(i => !i.isHide)">
                <a-sub-menu v-if="item.childs" :key="item.index" >
                    <span slot="title" class="title-box" :style="{ margin: isCollapse ? '0 0 0 14px' : '0 0 0 14px' }">
                        <a-icon class="menu-icon" :type="item.icon" />
                        <span>{{ item.content }}</span>
                    </span>
                    <a-menu-item v-for="item2 in item.childs" :key="item2.index" >
                        <span class="nav-item" :style="{ padding: isCollapse ? '0 0 0 24px' : '0 0 0 24px' }">{{ item2.content }}</span>
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item v-else :key="item.index">
                    <a-icon class="menu-icon" :type="item.icon" />
                    <span>{{ item.content }}</span>
                </a-menu-item>
            </template>
        </a-menu>
        <div class="toggle" :style="{ padding: isCollapse ? '0 0 0 14px' : '0 0 0 14px' }">
            <div class="icon" @click="onToggle">
                <span><a-icon :type="isCollapse ? 'menu-unfold' : 'menu-fold'"/></span>
            </div>
        </div>
    </a-layout-sider>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { AppState } from '@/store/modules/app';
// import { UserModule } from '../../store/modules/user';
// import * as API from '@/api';
import _ from 'lodash';

@Component
export default class Sidebar extends Vue {
    openKeys: any = [];
    selectedKeys: any = [];
    cacheOpenkeys: any = [];

    //当前路由
    get routePath() {
        return this.$route.path;
    }
    // get permissionIds() {
    //     return UserModule.permissionIds;
    // }
    menuList = [
        {
            index: '/application',
            icon: 'appstore',
            content: '知识应用',
        },
        {
            index: '/release',
            icon: 'upload',
            content: '知识发布',
        },
        {
            icon: 'cloud-sync',
            content: '语义训练',
            childs: [
                {
                    index: '/intention',
                    content: '意图管理',
                },
                {
                    index: '/wordset',
                    content: '词集管理',
                },
            ],
        },
        {
            icon: 'read',
            content: '知识管理',
            childs: [
                {
                    index: '/system',
                    content: '知识体系',
                },
                {
                    index: '/qalib',
                    content: '问答库',
                },
                {
                    index: '/document',
                    content: '文档库',
                },
            ],
        },
        {
            index: '/extract',
            icon: 'block',
            content: '知识抽取',
        },
        {
            index: '/statistical',
            icon: 'pie-chart',
            content: '统计分析',
        },
    ];

    // get filterMenuList() {
    //     let temp: any = [];
    //     this.menuList.forEach(item => {
    //         if (item.childs) {
    //             let childs = item.childs.filter(
    //                 childItem =>
    //                     !childItem.permission ||
    //                     (Array.isArray(childItem.permission)
    //                         ? childItem.permission.some(i => this.permissionIds.includes(i))
    //                         : this.permissionIds.includes(childItem.permission)),
    //             );
    //             if (childs.length) {
    //                 item.childs = childs;
    //                 temp.push(item);
    //             }
    //         } else {
    //             if (Array.isArray(item.permissions) && item.permissions.some(i => this.permissionIds.includes(i))) {
    //                 temp.push(item);
    //             } else if (this.permissionIds.includes(item.permissions)) {
    //                 temp.push(item);
    //             }
    //         }
    //     });
    //     return temp;
    // }
    get defaultActive() {
        if (this.$route.matched.length > 1) {
            return this.$route.matched[0].path;
        } else {
            return this.$route.path;
        }
    }
    get isCollapse() {
        return AppState.isCollapse;
    }

    // 路由等于高亮
    @Watch('routePath')
    onRoutePath() {
        this.getActivePath();
    }
    //获取高亮路由
    getActivePath() {
        let path = this.$route.path;

        if (this.isCollapse) {
            this.openKeys = [];
            this.cacheOpenkeys = '/' + path.split('/')[1];
        } else {
            this.openKeys = ['/' + path.split('/')[1]];
        }
        this.openKeys = this.isCollapse ? [] : ['/' + path.split('/')[1]];
        this.pushOpenkeys(path)
        this.selectedKeys = [path]
    }
     pushOpenkeys(path: any) {
        let item2Arr = ['/intention', '/wordset']
        let item3Arr = ['/system', '/qalib', '/document']
        if(item2Arr.includes(path)){
            this.openKeys.push('item_2')
        }else if(item3Arr.includes(path)){
            this.openKeys.push('item_3')
        }
     }

    mounted() {
        this.getActivePath();
        this.onResize();
    }

    // 展开菜单父级事件
    onOpenChange(openKeys:any) {
        this.openKeys = openKeys.length ? [openKeys.pop()] : [];
    }

    // 监听菜单选择事件
    onSelect(val:any) {
        document.body.scrollTop = 0;
        this.$router.push(val.key);
    }
    // 切换菜单折叠展开
    onToggle() {
        if (!this.isCollapse) {
            this.cacheOpenkeys = this.openKeys !== [] ? this.openKeys[this.openKeys.length-1] : [];
        }
        this.openKeys = this.isCollapse ? [this.cacheOpenkeys] : [];
        this.isCollapse && this.pushOpenkeys(this.cacheOpenkeys)
        AppState.SET_ISCOLLAPSE(!this.isCollapse);
    }

    // 监听窗口resize
    onResize() {
        const callback = () => {
            let flag = document.body.clientWidth <= 1400;
            // AppState.SET_ISSMALLSCREEN(flag);
            if (flag) {
                AppState.SET_ISCOLLAPSE(flag);
                this.cacheOpenkeys = this.openKeys[this.openKeys.length-1];
                this.openKeys = [];
            }
        };
        window.addEventListener('resize', _.debounce(callback, 200));
    }
}
</script>

<style lang="less" scoped>
// 侧边栏
.sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 5;
    background: @sidebar-background-color;
    flex: 0 0 208px !important;
    max-width: 208px !important;
    min-width: 208px !important;
    width: 208px !important;
    box-shadow: 1px 0 4px 0 rgba(0, 21, 41, 0.08);
    .sidebar-head {
        position: relative;
        z-index: 5;
        flex: 0 0 48px;
        height: 48px;
        width: 100%;
        transition: all 0.2s ease-in-out; // display: flex;
        // overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: start;
        background-color: @headerbar-background-color;
        box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.08);
        cursor: default;
        .name {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: @text-color;
            letter-spacing: 1px;
            margin-left: 11px;
            animation: delayShow 1s;
            user-select: none;
        }
    }
    .icon-sidebar {
        width: 48px !important;
    }
    .head-icon-img {
        width: 22px;
        height: 19.5px;
    }

    @media screen and (max-width: 1400px) {
        .head-icon-img {
            width: 18px;
            height: 16.5px;
        }
    }

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: rgb(83, 98, 110);
    }

    .sidebar {
        padding-top: 16px;
        margin-bottom: 48px;
        height: calc(100vh - 96px);
        overflow-y: auto;
        .menu-item {
            .menu-icon {
                width: 20px;
                height: 20px;
                font-size: 16px;
                margin: 0 12px 0 0;
                vertical-align: middle;
            }
            .ifly-icon-span {
                transform: translateY(-2px);
                display: inline-block;
                margin-left: 2px;
            }
            .menu-text {
                margin-left: 12px;
                width: 400px;
                font-size: 16px;
            }
            .nav-item {
                padding-left: 8px;
            }
        }
        .setting-wrapper {
            position: absolute;
            bottom: 10px;
            right: 0;
            left: 0;
            padding: 0 14px;
        }
    }

    .ant-menu-inline-collapsed{
        width: 48px;
    }
    .ant-menu-vertical .ant-menu-item:not(:last-child),
    .ant-menu-vertical-left .ant-menu-item:not(:last-child),
    .ant-menu-vertical-right .ant-menu-item:not(:last-child),
    .ant-menu-inline .ant-menu-item:not(:last-child){
        margin-bottom: 4px;
    }

    /deep/ .ant-menu-inline-collapsed {
        .ifly-icon-span {
            margin-right: 5px;
        }
    }

    .toggle {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        background: @sidebar-background-color;
        z-index: 10;
        .icon {
            padding: 16px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(0, 0, 0, 0.65);
            font-size: 18px;

            span {
                cursor: pointer;
            }
        }
        .anticon:hover {
            color: @primary-color;
        }
    }
    &.ant-layout-sider-collapsed {
        flex: 0 0 48px !important;
        max-width: 48px !important;
        min-width: 48px !important;
        width: 48px !important;
    }

    .ant-menu-item .anticon, .ant-menu-submenu-title .anticon{
        font-size: 16px;
    }

    .ant-menu-item ,
    .ant-menu-submenu-title ,
    .ant-menu-item .anticon ,
    .ant-menu-submenu-title .anticon  {
        transition: all 0.2s ease-in-out;
    }

    .ant-menu-item-selected > .menu-icon,
    .ant-menu-submenu-selected .menu-icon {
        opacity: 1;
    }
    .ant-menu-inline-collapsed > .ant-menu-item,
    .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item,
    .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title{
        padding: 0 14px !important;
    }
    .sidebar-container .ant-menu-inline.ant-menu-sub > .ant-menu-item{
        margin-left: 38px !important;
    }
    .ant-menu-vertical > .ant-menu-item,
    .ant-menu-vertical-left > .ant-menu-item,
    .ant-menu-vertical-right > .ant-menu-item,
    .ant-menu-inline > .ant-menu-item,
    .ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title{
        height: 48px;
        line-height: 48px;
    }

    .ant-menu-vertical .ant-menu-item::after,
    .ant-menu-vertical-left .ant-menu-item::after,
    .ant-menu-vertical-right .ant-menu-item::after,
    .ant-menu-inline .ant-menu-item::after{
        border-right-color: @primary-color;
    }

    :global {
        .ant-menu {
            color: @text-color;
            background: @sidebar-background-color;
        }
        .ant-menu-submenu > .ant-menu {
            background: @sidebar-background-color !important;
        }
        .ant-menu .ant-menu-item-selected {
            background: @sidebar-selected-background-color;
            color: @primary-color;
        }
        .ant-menu .ant-menu-sub {
            background: @sidebar-background-color;
        }
        .ant-menu .ant-menu-submenu-open {
            color: @primary-color;
        }
        .ant-menu-inline.ant-menu-sub > .ant-menu-item {
            padding-left: 8px !important;
        }
        /deep/ .ant-menu-inline-collapsed > .ant-menu-item,
        .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
            padding: 0 14px !important;
        }
        /deep/ .ant-menu-inline-collapsed {
            width: 48px !important;
        }
        .ant-menu-submenu-inline.ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow::before,
        .ant-menu-submenu-inline.ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow::after {
            background: linear-gradient(to right, @primary-color, @primary-color);
        }
    }
    @keyframes delayShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
}
</style>

<style lang="less">
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background: @primary-color !important;
}
.ant-menu-dark .ant-menu-sub.ant-menu-vertical {
    background: #27323c;
}
.ant-menu-submenu-popup {
    z-index: 2333 !important;
}
.message-count {
    position: absolute;
    top: 10px;
    right: 12px;
    line-height: 16px;
    font-size: 12px;
    color: white;
    background: #e72f1f;
    border-radius: 50%;
    width: 21px;
    height: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.ant-menu-dark .ant-menu-inline.ant-menu-sub {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) inset !important;
}
.ant-menu-vertical > .ant-menu-item,
.ant-menu-inline > .menu-item.ant-menu-item,
.ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
    height: 48px !important;
    line-height: 48px !important;
}
.menu-item.ant-menu-submenu.ant-menu-submenu-vertical.ant-menu-submenu-selected > .ant-menu-submenu-title {
    background: @sidebar-selected-background-color !important;
}
.sidebar-container {
    :global {
        .ant-menu-submenu > .ant-menu {
            background: @sidebar-background-color !important;
        }
    }
    // by_melies
    // antd 动画兼容，样式渲染过慢导致动画效果不一，改为vuedom 动态改变样式
    // .ant-menu-inline-collapsed > .ant-menu-submenu {
    //     padding: 0 0 0 14px !important;
    // }
    .ant-menu-item .anticon + span,
    .ant-menu-submenu-title .anticon + span {
        transition: none !important;
    }
    .ant-menu-inline,
    .ant-menu-vertical,
    .ant-menu-vertical-left {
        border-right: none;
    }
    .ant-menu-inline .ant-menu-item,
    .ant-menu-inline .ant-menu-submenu-title {
        width: 100%;
    }
    .ant-menu .ant-menu-submenu-open {
        color: @text-color !important;
    }
    .ant-menu-inline > .ant-menu-item {
        padding: 0 0 0 14px !important;
    }
    .ant-menu-submenu .title-box,
    .ant-menu-submenu-inline .title-box {
        position: relative;
        z-index: 2;
        background: @sidebar-background-color;
    }
    .ant-menu-submenu-selected {
        .title-box {
            background: @sidebar-background-color;
        }
        &.ant-menu-submenu-open {
            .title-box {
                background: @sidebar-background-color;
            }
        }
        &.ant-menu-submenu-vertical {
            .title-box {
                background: @sidebar-selected-background-color;
            }
        }
    }
    .ant-menu-item:active,
    .ant-menu-submenu-title:active {
        .title-box {
            background: #e6f7ff;
        }
    }
    .ant-menu-submenu-title .ant-menu-submenu-arrow {
        z-index: 1 !important;
    }
    .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
        padding: 0 !important;
        -webkit-transition: none;
        transition: none;
    }
    .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
        padding: 0 !important;
        -webkit-transition: none;
        transition: none;
    }
}
.sidebar::-webkit-scrollbar {
    width: 0px !important; /* 纵向滚动条*/
    height: 0px !important; /* 横向滚动条 */
    background-color: #fff !important;
}

/*定义滚动条轨道 内阴影*/
.sidebar::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0) !important;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0) !important;
    background-color: #fff !important;
}

/*定义滑块 内阴影*/
.sidebar::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0) !important;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0) !important;
    background-color: #d5d5d5 !important;
}
</style>
