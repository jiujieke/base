<template>
    <div class="left-part">
        <span class="visual-angle">账号分组视角</span><a-button type="link" @click="switchVa">切换</a-button>
        <div style="margin-top: 10px">
            <a-select v-model="searchKey" style="width: 100px" @change="searchKeyChange">
                <a-select-option value="001">
                  知识分类
                </a-select-option>
                <a-select-option value="002">
                  关联问答
                </a-select-option>
            </a-select>
        </div>
        <a-input-search placeholder="请输入关键词搜索" @search="onSearch" />
        <div class="all-intention">
            <span>所有意图（1000）</span>
            <a @click="gToEdit" class="all-inten-btn">前往修改</a>
        </div>
        <div class="bottom-tree">
            <a-tree
                :selected-keys="selectedKeys"
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                :tree-data="treeData"
                @expand="onExpand"
                @select="onSelect"
            >
                <template slot="title" slot-scope="{ value, num }">{{ value +'（' + num + '）'}}</template>
            </a-tree>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

const treeData = [
  {
    value: '0-0',
    key: '0-0',
    num: '30',
    children: [
      {
        value: '0-0-0',
        key: '0-0-0',
        num: '13',
        children: [
          { value: '0-0-0-0', key: '0-0-0-0', num: '2' },
          { value: '0-0-0-1', key: '0-0-0-1', num: '4' },
          { value: '0-0-0-2', key: '0-0-0-2', num: '7' },
        ],
      },
      {
        value: '0-0-1',
        key: '0-0-1',
        num: '9',
        children: [
          { value: '0-0-1-0', key: '0-0-1-0', num: '1' },
          { value: '0-0-1-1', key: '0-0-1-1', num: '3' },
          { value: '0-0-1-2', key: '0-0-1-2', num: '5' },
        ],
      },
      {
        value: '0-0-2',
        key: '0-0-2',
        num: '8',
      },
    ],
  },
  {
    value: '0-1',
    key: '0-1',
    num: '27',
    children: [
      { value: '0-1-0-0', key: '0-1-0-0', num: '19' },
      { value: '0-1-0-1', key: '0-1-0-1', num: '7' },
      { value: '0-1-0-2', key: '0-1-0-2', num: '1' },
    ],
  },
  {
    value: '0-2',
    key: '0-2',
    num: '7',
  },
];

@Component
export default class Lefttree extends Vue {
    searchKey: any = '001'
    searchValue: any = ''
    treeData: any = treeData
    expandedKeys: any = []
    autoExpandParent: any = true
    selectedKeys: any = []

    switchVa(){
        console.log('切换视角')
    }

    gToEdit(){
        console.log('前往修改')
    }

    searchKeyChange(value: any){
        console.log('value', value)
    }

    onSearch(value: any){
        this.searchValue = value
        console.log('onsearch', this.searchValue)
    }

    onExpand(expandedKeys: any) {
        console.log('onExpand', expandedKeys);
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
    }

    onSelect(selectedKeys: any, info: any) {
      console.log('onSelect', selectedKeys, info);
      this.selectedKeys = selectedKeys;
    }
}
</script>

<style lang="less" scoped>
.left-part{
    float: left;
    width: 20%;
    padding: 10px 20px;
    // height: calc(86vh);
    background-color: #fff;
    .visual-angle{
        font-size: 14px;
        color: #2a2e32;
    }
    .all-intention{
        margin-top: 15px;
    }
    .all-inten-btn{
        display: inline-flex;
        vertical-align: bottom;
        float: right;
    }
    .bottom-tree{
        margin-top: 6px;
        overflow: auto;
        height: calc(68.8vh);
    }
}
/deep/ .ant-select-selection{
    border: unset;
    box-shadow: unset;
}
</style>