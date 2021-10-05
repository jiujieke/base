
<template>
    <div class="container">
        <h1 class="title">知识应用</h1>
        <div class="header">
            <div class="filter-row">
                <div class="filter-row-left">
                    <div class="filter-item">
                        <div class="filter-label">搜索：</div>
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
                        <div class="filter-label">知识分类：</div>
                        <a-tree-select
                            v-model="classify"
                            :tree-data="treeData"
                            allow-clear
                            tree-default-expand-all
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                            placeholder="请选择知识分类"
                            @change="onChange"
                        />
                    </div>
                    <div class="filter-item">
                        <div class="filter-label">标签：</div>
                        <a-select 
                            v-model="label"
                            class="widget"
                            allow-clear
                            placeholder="请选择标签"
                            @change="handleChange"
                        >
                            <a-select-option v-for="item in labelList" :key="item.id" :value="item.id">
                                {{ item.detail }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                
                <div class="filter-row-right">
                    <a-button
                        type="primary"
                        class="filter-btn"
                        @click="add"
                        >新建</a-button
                    >
                </div>
            </div>
        </div>

        <div class="main">
            <div class="card-item" v-for="item in cardList" :key="item.id">
                <div class="card-head">
                    坐席助手
                    <div class="status">
                    <button :class="item.status === '2' ? 'dot-blue' : 'dot-red'" />{{ item.status === '2' ? '连接中' : '未连接'}}</div>
                </div>
                <div class="card-body">
                    <div class="card-content">
                        <span class="card-field">应用ID：</span>
                        <span class="card-value">{{item.appId}}</span>
                    </div>
                    <div class="card-content">
                        <span class="card-field">调用知识方式：</span>
                        <span class="card-value">{{ item.mode }}</span>
                    </div>
                    <div class="card-content">
                        <span class="card-field">可用知识分类：</span>
                        <span class="card-value">{{ item.classify}}</span>
                    </div>
                    <div class="card-content">
                        <span class="card-field">可用知识标签：</span>
                        <span class="card-value">{{ item.label }}</span>
                    </div>
                    <div class="card-content">
                        <span class="card-field">最近下发时间：</span>
                        <span class="card-value" :title="item.nearTime">{{ item.nearTime }}</span>
                    </div>
                </div>
                <div class="card-foot">
                    <a-button type="link" class="edit-btn" @click="edit(item)">
                        编辑
                    </a-button>
                    <a-button type="link" class="del-btn" @click="remove(item)">
                        删除
                    </a-button>
                </div>
            </div>
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
            v-model="addVisible"
            :width='700'
            title="新建应用"
            ok-text="确认"
            cancel-text="取消"
            :maskClosable='false'
            @ok="handleOk"
            @cancel="handleCancle"
            :mask-closable='false'
        >
            <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
                <a-form-model-item ref="applicationName" label="应用名称" prop="applicationName">
                    <a-input
                        v-model="form.applicationName"
                        :max-length='20'
                        placeholder="请输入应用名称"
                    />
                </a-form-model-item>
                <a-form-model-item ref="explain" label="应用说明" prop="explain">
                    <a-textarea
                        v-model="form.explain"
                        :auto-size="{ minRows: 3, maxRows: 6 }"
                        :max-length='200'
                        placeholder="请输入应用说明，200个字以内"
                    />
                </a-form-model-item>
                <a-form-model-item ref="address" label="应用地址" prop="address">
                    <a-input
                        v-model="form.address"
                        placeholder="请输入应用地址"
                    />
                </a-form-model-item>
                <a-form-model-item ref="appKey" label="AppKey" prop="appKey">
                    <a-input-password
                        v-model="form.appKey"
                        autocomplete="new-password"
                        placeholder="请输入AppKey"
                    />
                </a-form-model-item>
                <a-form-model-item ref="appSecret" label="AppSecret" prop="appSecret">
                    <a-input-password
                        v-model="form.appSecret"
                        autocomplete="new-password"
                        placeholder="请输入AppSecret"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <application-drawer
            v-if="editVisible"
            :visible="editVisible"
            :dataInfo="applicationInfo"
            :tabActiveKey="activeKey"
            @drawerClose="drawerClose"
        />

    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import drawer from './drawer.vue';

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];
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

const cardList = [
    {
        id:'3154',
        detail: 'qweqweqwe',
        status: '2',
        appId: '2020071212050112',
        mode: '中台下发',
        classify: '全部',
        label: '全部',
        nearTime: '黄小红 更新于2020-04-05 14:32:34'
    },
    {
        id:'31124',
        detail: 'qweqweqwe',
        status: '2',
        appId: '2020071212050112',
        mode: '中台下发',
        classify: '全部',
        label: '全部',
        nearTime: '黄小红 更新于2020-04-05 14:32:34'
    },
    {
        id:'31532314',
        detail: 'qweqweqwe',
        status: '1',
        appId: '2020071212050112',
        mode: '中台下发',
        classify: '全部',
        label: '全部',
        nearTime: '黄小红 更新于2020-04-05 14:32:34'
    },
    {
        id:'31fr54',
        detail: 'qweqweqwe',
        status: '2',
        appId: '2020071212050112',
        mode: '中台下发',
        classify: '全部',
        label: '全部',
        nearTime: '黄小红 更新于2020-04-05 14:32:34'
    },
    {
        id:'31f333r54',
        detail: 'qweqweqwe',
        status: '2',
        appId: '2020071212050112',
        mode: '中台下发',
        classify: '全部',
        label: '全部',
        nearTime: '黄小红 更新于2020-04-05 14:32:34'
    },
]

const defaultForm = () => ({
    applicationName: '',
    explain: '',
    address: '',
    appKey: '',
    appSecret: ''
})

@Component({
    components: {
        'application-drawer': drawer,
    },
})
export default class Application extends Vue {
    treeData: any = treeData;
    labelList: any = labelList;
    keyword: any = '';
    classify: any = [];
    label: any = [];
    page: any = 1;
    total: any = 231;
    cardList: any = cardList;
    addVisible: any = false;
    editVisible: any = false;
    applicationInfo: any = {};
    labelCol = { span: 5 };
    wrapperCol = { span: 16 };
    form:any = defaultForm()
    activeKey: any = '1'
    rules = {
      applicationName: [
        { required: true, message: '请输入应用名称', trigger: 'blur' },
        // { min: 0, max: 20, message: '应用名称不能多于20个字', trigger: 'blur' },
      ],
      address: [{ required: true, message: '请输入应用地址', trigger: 'blur' }],
      appKey: [{ required: true, message: '请输入AppKey', trigger: 'blur' }],
      appSecret:  [{ required: true, message: '请输入AppSecret', trigger: 'blur' }]
    }

    get btnDisable(){
        return !!(this.form.applicationName && this.form.address && this.form.appKey && this.form.appSecret)
    }
    
    add(){
        this.addVisible = true
    }

    onSearch(){
        console.log('onSearch', this.keyword)
    }

    onChange(){
        console.log('classify', this.classify)
    }

    handleChange(){
        console.log('handleChange', this.label)
    }

    edit(item:any){
        this.applicationInfo = item
        this.editVisible = true
    }

    remove(){
        let _this = this
        this.$confirm({
            title: '确认要删除该应用吗？删除后数据无法恢复',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                _this.$message.success('已删除应用 坐席助手');
            },
            onCancel() {
                console.log('Cancel');
            },
            class: 'test',
        });
    }

    cannotDel(){
        this.$warning({
        title: '该应用已有调用知识，无法删除，请先修改调用知识范围',
        okText: '知道了'
      });
    }

    onPageChange(val:any){
        this.page = val;
    }

    handleOk(){
        (this.$refs.ruleForm as any).validate((valid:any) => {
            if (valid) {
                console.log('form', this.form.address)
                this.handleCancle()
                this.editVisible = true
                this.activeKey = '2'
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }
    handleCancle(){
        this.addVisible = false;
        (this.$refs.ruleForm as any).resetFields();
    }

    drawerClose(visible: any){
        this.editVisible = visible
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
        .filter-btn {
            width: 85px;
        }
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

            & > .ant-select {
                flex: 0 0 240px;
                width: 240px;
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
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 24px;

        .card-item{
            width: 26%;
            min-width: 350px;
            max-width: 500px;
            height: 310px;
            background: #ffffff;
            border: 1px solid #e0e3e6;
            border-radius: 8px;
            margin: 30px;

            .card-head{
                padding: 16px 7px 14px 5px;
                margin: 0 18px;
                color: #2A2E32;
                font-size: 14px;
                border-bottom: 1px solid #E8EDF2;

                .status{
                    float: right;
                    color: #3B3B3B;
                    font-size: 12px;
                    font-weight: 300;
                }
                .dot-red {
                    width: 7px;
                    height: 7px;
                    margin-right: 5px;
                    border-radius: 100px;
                    background-color: red;
                    opacity: 0.5;
                }
                .dot-blue {
                    width: 7px;
                    height: 7px;
                    margin-right: 5px;
                    border-radius: 100px;
                    background-color: blue;
                    opacity: 0.5;
                }
            }
            .card-body{
                margin: 20px 20px 0 20px;
                padding-bottom: 10px; 
                border-bottom: 1px solid #E8EDF2;

                .card-content{
                    margin: 13px 8px;
                }

                .card-field{
                    font-size: 13px;
                    font-weight: 300;
                }
                .card-value{
                    // display: inline-block;
                    // vertical-align: bottom;
                    // overflow: hidden;
                    // white-space: nowrap;
                    // text-overflow: ellipsis;
                    font-size: 14px;
                    font-weight: 500;
                }
            }
            .card-foot{
                margin-top: 10px;
                .edit-btn{
                    width: 50%;
                    border-right: 1px solid #E8EDF2;
                }
                .del-btn{
                    width: 50%;
                    color: red;
                }
            }
        }
    }
    .footer{
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>