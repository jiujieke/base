<template>
    <div class="container">
        <h1 class="title">知识抽取</h1>
        <div class="header">
            <div class="filter-row">
                <div class="filter-row-left">
                    <div class="filter-item">
                        <a-select v-model="searchType" style="width:100px" @change="searchTypeChange">
                            <a-select-option value="001">
                              文件名称
                            </a-select-option>
                            <a-select-option value="002">
                              文件内容
                            </a-select-option>
                        </a-select>
                        <a-input-search
                            v-model="keyword"
                            class="widget"
                            allow-clear
                            placeholder="请输入关键词搜索"
                            @search="onSearch"
                        >
                        </a-input-search>
                    </div>
                    <div class="filter-item">
                        <div class="filter-label">所属分类：</div>
                        <a-select 
                            v-model="classify"
                            class="widget"
                            mode="multiple"
                            allow-clear
                            show-search
                            option-filter-prop="children"
                            :max-tag-count="1"
                            placeholder="请选择所属分类"
                            @change="handleClassifyChange"
                        >
                            <a-select-option v-for="item in classifyList" :key="item.id" :value="item.id">
                                {{ item.detail }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="filter-row-right">
                    <a-button
                        type="primary"
                        @click="add"
                        >新建</a-button
                    >
                </div>
            </div>
        </div>

        <div class="main">
            <a-tabs  :activeKey="activeKey" @change="callbackTabs">
                <a-tab-pane key="1" :tab="tab1Name">
                  Content of Tab Pane 1
                </a-tab-pane>
                <a-tab-pane key="2" :tab="tab2Name" force-render>
                  Content of Tab Pane 2
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';


const classifyList = [
    {
        id: '3154',
        detail: '所属分类一'
    },
    {
        id: 'champion',
        detail: '所属分类二'
    },
    {
        id: 'TI10',
        detail: '所属分类三'
    },
    {
        id: 'GSG.LGD',
        detail: '所属分类四'
    },
]
@Component
export default class Extract extends Vue {
    searchType: any = '001'
    keyword: any = ''
    classify: any = []
    classifyList: any = classifyList
    activeKey: any = '1'

    get tab1Name(){
        const num = 15
        return `抽取中（${num}）`
    }
    get tab2Name(){
        const num = 350
        return `已完成（${num}）`
    }

    searchTypeChange(){
        console.log('searchTypeChange', this.searchType)
    }
    onSearch(){
        console.log('onSearch', this.keyword)
    }
    add(){
        console.log('新增')
    }
    handleClassifyChange(){
        console.log('handleChange', this.classify)
    }
    callbackTabs(key: any){
        this.activeKey = key
    }
}
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding: 10px;
    .title{
        color: #2A2E32;
        font-size: 20px;
        padding: 12px 24px;
    }
    .header{
        .filter-row {
            display: flex;
            justify-content: space-between;
        }
        .filter-row-right {
            display: flex;
            margin-left: 24px;
            flex: 0 0 auto;
            align-items: center;
            height: 32px;
            padding-right: 10px;
            margin-bottom: 24px;
        }
        .filter-row-left {
            flex: 1 1 auto;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        .filter-item {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            margin-right: 24px;
            .filter-label {
                width: 84px;
                flex: 0 0 84px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                line-height: 22px;
                text-align: right;
            }

            .widget {
                width: 240px;
                flex: 0 0 240px;

                /* 处理标签移除时飞出选择框的异常 */
                .ant-select-selection--multiple {
                    overflow: hidden;
                }
                .ant-select-selection__rendered {
                    overflow-x: hidden;
                }
            }
            /* 处理控件层级问题*/
            .ant-select-dropdown {
                z-index: 3;
            }
            .ant-select-selection--multiple {
                overflow: hidden;
                .ant-select-selection__rendered {
                    overflow-x: hidden;
                }
            }
        }
    }

    .main{

    }
}
</style>