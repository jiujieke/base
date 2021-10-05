<template>
    <div class="container">
        <h1 class="title">意图管理</h1>
        <left-tree ></left-tree>

        <div class="right-table">
            <div class="breadcrumb">
                <a-breadcrumb>
                    <a-breadcrumb-item>一级分类</a-breadcrumb-item>
                    <a-breadcrumb-item>二级分类</a-breadcrumb-item>
                    <a-breadcrumb-item>三级分类</a-breadcrumb-item>
                    <a-breadcrumb-item>四级分类</a-breadcrumb-item>
                </a-breadcrumb>
            </div>

            <div class="filter-row">
                <div class="filter-row-left">
                    <div class="filter-item">
                        <a-select v-model="searchType" style="width: 100px;" @change="searchTypeChange">
                            <a-select-option value="001">
                              意图
                            </a-select-option>
                            <a-select-option value="002">
                              关联问答
                            </a-select-option>
                        </a-select>
                        <a-input-search
                            v-model="searchKeyword"
                            class="widget"
                            allow-clear
                            placeholder="请输入关键词搜索"
                            @search="onSearchKeyword"
                        >
                        </a-input-search>
                    </div>
                    <div class="filter-item">
                        <div class="filter-label">标签：</div>
                        <a-select 
                            v-model="label"
                            class="widget"
                            allow-clear
                            placeholder="请选择标签"
                            @change="handleLabelChange"
                        >
                            <a-select-option v-for="item in labelList" :key="item.id" :value="item.id">
                                {{ item.detail }}
                            </a-select-option>
                        </a-select>
                        <a-icon type="setting" style="margin-left: 4px" @click="toLabelPage" />
                    </div>
                    <div class="filter-item">
                        <div class="filter-label">引用词集：</div>
                        <a-select
                            mode="multiple"
                            v-model="wordset"
                            class="widget"
                            allow-clear
                            :filter-option="false"
                            :max-tag-count="1"
                            :get-popup-container="node => node.parentNode"
                            placeholder="请选择引用词集"
                            @change="handleWordsetChange"
                        >
                            <div slot="dropdownRender" slot-scope="menu">
                                <div
                                    style="padding: 4px 8px; cursor: pointer;"
                                    @mousedown="e => e.preventDefault()"
                                >
                                    <a-button size='small' @click="selectWordsetType('synonym')">同义词</a-button>
                                    <a-button size='small' style="margin-left:5px" @click="selectWordsetType('similar')">同类词</a-button>
                                </div>
                                <v-nodes :vnodes="menu" />
                            </div>
                            <a-select-option v-for="item in wordsetList" :key="item.id" :value="item.id">
                                {{ item.detail }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="filter-row-right">
                    <a-button
                        class="mar-right10"
                        @click="toImport"
                        >导入</a-button
                    >
                    <a-button
                        type="primary"
                        @click="toTest"
                        >测试</a-button
                    >
                    <a-tooltip placement="left">
                        <template slot="title">
                            <div class="tooltip-word">1、意图及问答修改保存后，本地环境模型将即时生效，可测试效果，正式应用环境不受影响；</div>
                            <div class="tooltip-word">2、测试完成后，请前往“知识发布”页面，进行 统一发布至正式环境，更新正式环境数据。</div>
                        </template>
                        <a-icon type="question-circle" theme="twoTone" :two-tone-color="'#d3d3d3'" style="margin-left: 4px;font-size:16px" />
                    </a-tooltip>
                </div>
            </div>
            
            <div class="export-btn">
                <a-button
                    :disabled="!hasSelected"
                    class="mar-right10"
                    @click="toExport"
                    >导出</a-button
                >
            </div>

            <div class="main">
                <a-table
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :columns="columns"
                    :row-key="record => record.name"
                    :data-source="dataSource"
                    :scroll="{ x: 1450 }"
                    :pagination="false"
                    :custom-row="clickTableRow"
                    @change="handleTableChange"
                >
                    <template slot="tag" slot-scope="text, record">
                        <a-tag v-for="(item, index) in record.tag" :key="index">{{ item }}</a-tag>
                    </template>
                    <template slot="QAs" slot-scope="text, record">
                        <a-tooltip placement="topLeft">
                            <template slot="title">
                                <span class="qa-tooltip-span">{{ record.qa[0] }}</span>
                                <!-- <a-divider style="margin: 10px 0 0 0;" /> -->
                                <div class="qa-tooltip-div" v-if="record.qa.length > 1">
                                    <a class="qa-tooltip-a" @click="linkToMore(record.qa)">查看更多 》</a>
                                </div>
                            </template>
                            <span v-if="record.qa[0].length <= 8">{{ record.qa[0] }}</span>
                            <span v-if="record.qa[0].length > 8">{{ record.qa[0].slice(0,8) + '...' }}</span>
                        </a-tooltip>
                    </template>
                    <template slot="action" slot-scope="text, record">
                        <a-button type="link" @click="toEdit(record)">编辑</a-button>
                    </template>
                </a-table>
            </div>

            <div class="footer">
                <a-pagination
                    :current.sync="page"
                    :page-size="10"
                    :total="total"
                    :show-total="total => `共 ${total} 条`"
                    show-quick-jumper
                    @change="onPageChange"
                ></a-pagination>
            </div>

            <a-modal
                title="答案预览"
                v-model="previewVisible"
                :width="720"
            >
                <template slot="footer">
                    <a-button type="link" class="mar-right10" @click="prevCarousel"><a-icon type="left" />上一条</a-button>
                    <a-button type="link" @click="nextCarousel">下一条<a-icon type="right" /></a-button>
                </template>
                <div class="preview-header" >
                    <h4 class="preview-header-label">问题：</h4>
                    <div class="preview-header-detail">这是一个问题。这是一个问题。这是一个问题。这是一个问题。这是一个问题。这是一个问题。</div>
                </div>
                <div>
                    <div class="group-btn">
                        <a-button class="mar-right10" size="small" v-for="(item, index) in carouselData" :key="index" @click="goToCarousel(index)">{{ `回答${index + 1}`}}</a-button>
                    </div>
                    <div>
                        <a-carousel ref="varousel">
                            <div v-for="(item, index) in carouselData" :key="index" class="preview-header">
                                <h4 class="preview-header-label">{{ `回答${index+1}：` }}</h4>
                                <div class="preview-header-detail">{{item}}</div>
                            </div>
                        </a-carousel>
                    </div>
                </div>
            </a-modal>

            <a-modal
                title="导入意图"
                v-model="importVisible"
                :width="720"
                :maskClosable="false"
                @ok="importHandleOk"
                @cancle="importHandleCancle"
                :okText="'上传并导入'"
            >
                <div class="import-header">
                    <a-icon type="exclamation-circle" theme="twoTone" :two-tone-color="twoToneColor" />
                    <span class="tips">若同时调用意图库，则可在应用产品使用语义搜索</span>
                    <a class="import-header-a" href="aiyinLogo.png" download="template" target="_blank">下载模板</a>
                </div>
                <a-upload-dragger
                    name="file"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    @change="fileHandleChange"
                >
                    <p class="ant-upload-drag-icon">
                        <a-icon type="inbox" />
                    </p>
                    <p class="ant-upload-text">
                        点击或将文件拖拽到此处导入
                    </p>
                    <p class="ant-upload-hint">
                        支持文件：csv文件，单个文件小于等于10M
                    </p>
                </a-upload-dragger>
                <div class="import-text" style="margin-top: 20px">
                    <p>1. 系统将按意图名称排重，导入数据；</p>
                    <p>2. 若导入的数据和当前系统数据重复，将自动合并排重至原记录下（追加语料及规则）；</p>
                    <p>3. 若导入的数据当前系统不存在，将导入失败；</p>
                    <p>4. 请单次导入小于10000个意图。</p>
                </div>
            </a-modal>

            <intent-drawer
                v-if="editVisible"
                :visible="editVisible"
                :dataInfo="editRecord"
                @drawerClose="drawerClose"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import LeftTree from '@/components/common/lefttree.vue';
import drawer from './intentDrawer.vue'

const labelList = [
    {
        id: '3154',
        detail: '标签一'
    },
    {
        id: 'champion',
        detail: '标签二'
    },
    {
        id: 'TI10',
        detail: '标签三'
    },
    {
        id: 'GSG.LGD',
        detail: '标签四'
    },
]

const wordsetList = [
    {
        id: 'xiao8',
        detail: '词集一'
    },
    {
        id: 'ame',
        detail: '词集二'
    },
    {
        id: 'nts',
        detail: '词集三'
    },
    {
        id: 'xinq',
        detail: '词集四'
    },
]

const columns = [
    {
      title: '意图名称',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '意图内容',
      dataIndex: 'content',
      width: '10%',
    },
    {
      title: '所属分类',
      dataIndex: 'classify',
      filters: [
      { text: '本级分类', value: 'level' },
      { text: '子集分类', value: 'subset' },
    ],
      width: '8%',
    },
    {
      title: '标签',
      dataIndex: 'tag',
      scopedSlots: { customRender: 'tag' },
      width: '16%',
    },
    {
      title: '关联问答',
      dataIndex: 'qa',
      scopedSlots: { customRender: 'QAs' },
      width: '10%',
    },
    {
      title: '引用词集数',
      dataIndex: 'wordsetNum',
      width: '8%',
    },
    {
      title: '有无提取变量',
      dataIndex: 'ifVariables',
      filters: [
      { text: '有', value: 'y' },
      { text: '无', value: 'n' },
    ],
      width: '10%',
    },
    {
      title: '更新人',
      dataIndex: 'updater',
      width: '8%',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      sorter: true,
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      width: '8%',
    },
]

@Component({
    components: {
        'left-tree': LeftTree,
        VNodes: {
            functional: true,
            render: (h: any, ctx: any) => ctx.props.vnodes,
        },
        'intent-drawer': drawer,
    }
})
export default class Intention extends Vue {
    twoToneColor: any = '#1D5EFF'
    searchType: any = '001'
    searchKeyword: any = ''
    label: any = []
    wordset: any = []
    labelList: any = labelList
    wordsetList: any = wordsetList
    columns: any = columns
    selectedRowKeys: any = []
    page: any = 1
    total: any = 231
    previewVisible: any = false
    importVisible: any = false
    carouselData: any = []
    fileList: any = []
    importSuccessNum: any = 15
    importFailNum: any = 15
    editRecord: any = {}
    editVisible: any = false
    dataSource: any = [
        {
            name: 'psglgd',
            content: '内容',
            classify: 'level',
            tag: ['标签一', '标签二', '标签三', '标签四'],
            qa: ['qqqaqweqweaa', 'vvvvcvcvcvcvcvcvcvcv', '答案答案答案答案答案答案答案答案'],
            wordsetNum: '23',
            ifVariables: 'y',
            updater: 'admin',
            updateTime: '2021-09-26 12:00:00',
        }
    ]

    get hasSelected() {
      return this.selectedRowKeys.length > 0;
    }


    selectWordsetType(str: any) {
        if(str === 'synonym'){
            console.log('同义词')
        }else if(str === 'similar'){
            console.log('同类词')
        }
    }
    onPageChange(val:any){
        this.page = val;
    }

    searchTypeChange(){
        console.log('searchTypeChange', this.searchType)
    }

    selectType(str:any){
        if(str === '001'){
            this.searchType = '意图'
        }else{
            this.searchType = '关联问答'
        }
    }

    onSearchKeyword(val:any){
        this.searchKeyword = val
        console.log('val', val)
    }

    toImport(){
        this.importVisible = true
    }

    importHandleCancle(){
        this.importVisible = false
        this.fileList = []
    }

    importHandleOk(){
        const h = this.$createElement;
        const _this = this
        this.$success({
        title: '导入结果提示',
        content: h('div', {}, [
            h('div', `导入成功数：${_this.importSuccessNum}`),
            h('div', `导入失败数：${_this.importFailNum}`),
            h('a-button', { style:'margin-top:6px;margin-left:-10px', on:{click:_this.downloadImportResult}, attrs:{type:'link',size:'small'}}, ' 下载导入结果报告'),
        ]),
        okText: '确认',
        onOk(){
            _this.importHandleCancle()
        }
      });
    }

    downloadImportResult(){
        console.log('下载导入结果报告')
    }

    toTest(){
        console.log('测试')
    }

    toExport(){
        console.log('toExport')
    }

    clickTableRow(record: any) {
        return {
            on: {
                click: () => {
                    this.toEdit(record);
                },
            },
        };
    }
    
    handleLabelChange(){
        console.log('handleLabelChange', this.label)
    }

    handleWordsetChange(){
        console.log('handleWordsetChange', this.wordset)
    }

    toLabelPage(){
        alert('前往标签管理页')
    }

    onSelectChange(selectedRowKeys:any) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    }
    
    handleTableChange(pagination:any, filters:any, sorter:any){
        console.log('pagination, filters, sorter', pagination, filters, sorter)
    }

    toEdit(record: any){
        console.log('edit', record)
        this.editRecord = record
        this.editVisible = true
    }
    
    drawerClose(visible: any){
        this.editVisible = visible
    }

    linkToMore(data: any){
        this.carouselData = data
        this.previewVisible = true
    }

    prevCarousel(){
        (this.$refs.varousel as any).prev()
    }

    nextCarousel(){
       (this.$refs.varousel as any).next()
    }

    goToCarousel(index: any){
       (this.$refs.varousel as any).goTo(index)
    }

    fileHandleChange(info: any) {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            this.$message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            this.$message.error(`${info.file.name} file upload failed.`);
        }
        this.fileList = info.fileList;
    }
}
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    background-color: #f0f2f5;
    // height: calc(91.8vh);
    
    .title{
        color: #2A2E32;
        font-size: 20px;
        padding: 0 24px;
    }
    .right-table{
        float: right;
        width: 79%;
        overflow: auto;
        min-height: calc(86vh);
        background-color: #fff;
        .breadcrumb{
            margin: 10px 0 10px 20px;
        }
    }
    .filter-row {
        padding: 4px;
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
            width: 234px;
            flex: 0 0 240px;
        }
    }

    .export-btn{
        position: absolute;
        right: 23px;
    }

    .main{
        flex: 1 1 auto;
        display: flex;
        min-height: calc(26vh);
        overflow: auto;
        padding: 40px 20px 20px 20px;
    }

    .footer{
        margin: 16px 10px 0 0;
        display: flex;
        justify-content: flex-end;
    }
    
}

.tooltip-word{
    font-size: 12px;
}

.mar-right10{
    margin-right: 10px;
}

.qa-tooltip-span{
    font-size: 12px;
}
.qa-tooltip-div{
    font-size:12px;
    overflow: auto;
    margin-top:10px
}
.qa-tooltip-a{
    float: right;
}

.preview-header{
    display: flex !important;
    .preview-header-label{
        min-width: 50px;
    }
    .preview-header-detail{
        font-size: 12px;
        line-height: 20px;
        color: black;
    }
}

.import-header{
    margin: 10px 0;

    .import-header-a{
        float: right;
    }
}
.import-text {
    margin-top: 20px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.85);
    p {
        margin: 0;
    }
}

.group-btn{
    margin: 12px 0;
}

.ant-carousel /deep/ .slick-slide {
    min-height: 160px;
    max-height: 300px;
    overflow: auto;
}

.ant-carousel /deep/ .slick-slide {
  color: black;
}

.tips{
    font-size: 13px;
    margin-left: 5px;
}
// .bottom-btn{
//     text-align: end;
//     padding: 10px 0
// }
// /deep/ .ant-modal-body{
//     padding-bottom: 0px;
// }
// /deep/ .ant-select-selection{
//     border: unset;
//     box-shadow: unset;
// }
</style>