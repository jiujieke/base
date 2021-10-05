<template>
    <a-drawer
        :width="920"
        :visible="visible"
        :mask-closable="false"
        @close="editClose"
    >
        <template slot="title">
            <div class="drawer-head">
                坐席助手
                <div class="drawer-time">最近下发时间：{{ dataInfo.nearTime }}</div>
                <div class="drawer-appId">应用ID：{{ dataInfo.appId }}</div>
                <div class="drawer-status">
                <button :class="dataInfo.status === '2' ? 'dot-blue' : 'dot-red'" />{{ dataInfo.status === '2' ? '连接中' : '未连接'}}</div>
            </div>
        </template>
        <a-tabs :active-key="activeKey" @change="callback">
            <a-tab-pane key="1" tab="可用知识">
                <a-form-model
                    ref="knowledgeForm"
                    :model="knowledgeForm"
                    :rules="knowledgeRules"
                    :label-col="{ span: 3}"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-model-item ref="knowledgeType" label="调用知识方式" prop="knowledgeType">
                        <a-radio-group v-model="knowledgeForm.knowledgeType" @change="changeKnowledgeType">
                            <a-radio-button value="01">
                                中台下发
                            </a-radio-button>
                            <a-radio-button value="02">
                                应用请求
                            </a-radio-button>
                        </a-radio-group>
                        <a-tooltip placement="right">
                            <template slot="title">
                                <div class="tooltip-word">
                                    1、中台下发：在知识中台发起知识下发，复制对应数据给应用产品，
                                    需要应用产品有自身的数据存储，数据使用更安全，
                                    但会和知识中台存在知识内容的差异；应用产品确认接受数据才会更新；
                                </div>
                                <div class="tooltip-word">
                                    2、应用请求：应用产品可直接请求查询知识中台的知识数据，
                                    返回至自身使用，应用产品无需有数据存储，
                                    使用知识内容和知识中台完全一致
                                </div>
                            </template>
                            <a-icon type="question-circle" theme="twoTone" :two-tone-color="twoToneColor" style="margin-left: 8px" />
                        </a-tooltip>
                    </a-form-model-item>
                    <a-form-model-item ref="knowledgeRange" label="调用知识范围" prop="knowledgeRange">
                        <a-radio-group v-model="knowledgeForm.knowledgeRange" v-for="item in knowledgeRangeArr" :key="item.code">
                            <a-radio :value="item.code">
                                {{ item.value }}
                            </a-radio>
                        </a-radio-group>
                        <div style="margin-top: -15px;">
                            <a-icon type="exclamation-circle" theme="twoTone" :two-tone-color="twoToneColor" />
                            <span class="tips">若同时调用意图库，则可在应用产品使用语义搜索</span>
                        </div>
                    </a-form-model-item>
                    <div class="select-part">
                        <div class="select-part-word">
                            知识所属的分类及标签需
                            <a-select v-model="condition" style="width: 100px;margin: 0 10px" @change="conditionHandleChange" >
                                <a-select-option value="001">
                                  同时满足
                                </a-select-option>
                                <a-select-option value="002">
                                  任一满足
                                </a-select-option>
                            </a-select>
                            如下所选的知识分类及标签
                            
                            <a-tooltip placement="right">
                                <template slot="title">
                                    <div class="tooltip-word">1、同时满足：当知识的所属分类及标签，均在勾选范围内容，才会被使用（交集）；</div>
                                    <div class="tooltip-word">2、任一满足：当知识的所属分类及标签，任意1项勾选范围内容，就会被使用（并集）</div>
                                </template>
                                <a-icon type="question-circle" theme="twoTone" :two-tone-color="twoToneColor" style="margin-left: 5px" />
                            </a-tooltip>
                        </div>
                        <div class="select-part-content">
                            <div class="top-search">搜索<a-input-search placeholder="请输入关键词搜索知识分类" style="width: 230px;margin-left:20px" @search="onSearch" /></div>
                            <div class="left-tree">
                                <a-tree
                                    v-model="checkedKeys"
                                    checkable
                                    :selected-keys="selectedKeys"
                                    :tree-data="treeData"
                                />
                            </div>
                            <div class="right-tree">
                                <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                                    全部
                                </a-checkbox>
                                <br />
                                <a-checkbox-group class="label-group" v-model="checkedList" :options="plainOptions" @change="onChangeLabel" />
                            </div>
                        </div>
                    </div>
                    <a-form-model-item :wrapper-col="{ span: 14, offset: 0 }" v-if="knowledgeForm.knowledgeType === '01'">
                        <a-button type="primary" @click="saveSetting">
                          保存配置
                        </a-button>
                        <a-button type="primary" style="margin-left: 10px;">
                          保存并下发知识
                        </a-button>
                        <a-button type="primary" style="margin-left: 10px;" @click="lssueKnowledge">
                          下发知识
                        </a-button>
                    </a-form-model-item>
                    <a-form-model-item :wrapper-col="{ span: 14, offset: 0 }" v-if="knowledgeForm.knowledgeType === '02'">
                        <a-button type="primary">
                          保存配置
                        </a-button>
                    </a-form-model-item>
                </a-form-model>
            </a-tab-pane>
            <a-tab-pane key="2" tab="应用配置" force-render>
              <div class="tab-key2">
                  <div class="tab-key2-top">
                        <div style="margin: 15px 0 15px 15px;">
                            <a-icon type="exclamation-circle" theme="twoTone" :two-tone-color="twoToneColor" />
                            <span class="tab-key2-tips">若修改应用参数配置后，需重新连接并重新保存或下发数据，否则可用知识配置将无法生效</span>
                        </div>
                        <strong style="margin-left: 10px">基础信息</strong>
                        <a-form-model
                            ref="basicinfoForm"
                            :model="basicinfoForm"
                            :rules="basicinfoRules"
                            :label-col="{ span: 3}"
                            :wrapper-col="{ span: 13}"
                            style="margin-top: 10px"
                        >
                            <a-form-model-item ref="applicationName" label="应用名称" prop="applicationName">
                                <a-input
                                    v-model="basicinfoForm.applicationName"
                                    :max-length='20'
                                    placeholder="请输入应用名称"
                                />
                            </a-form-model-item>
                            <a-form-model-item ref="explain" label="应用说明" prop="explain">
                                <a-textarea
                                    v-model="basicinfoForm.explain"
                                    :auto-size="{ minRows: 3, maxRows: 6 }"
                                    :max-length='200'
                                    placeholder="请输入应用说明，200个字以内"
                                />
                            </a-form-model-item>
                            <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }" >
                                <a-button type="primary">
                                  保存
                                </a-button>
                            </a-form-model-item>
                        </a-form-model>
                  </div>
                  <div class="tab-key2-under">
                      <div class="left-form">
                            <strong style="margin-left: 10px">参数配置</strong>
                            <a-form-model
                                ref="settingForm"
                                :model="settingForm"
                                :rules="settingRules"
                                :label-col="{ span: 7}"
                                :wrapper-col="{ span: 17}"
                                style="margin-top: 10px"
                            >
                                <a-form-model-item ref="address" label="应用地址" prop="address">
                                    <a-input
                                        v-model="settingForm.address"
                                        placeholder="请输入应用地址"
                                    />
                                </a-form-model-item>
                                <a-form-model-item ref="appKey" label="AppKey" prop="appKey">
                                    <a-input-password
                                        v-model="settingForm.appKey"
                                        autocomplete="new-password"
                                        placeholder="请输入AppKey"
                                    />
                                </a-form-model-item>
                                <a-form-model-item ref="appSecret" label="AppSecret" prop="appSecret">
                                    <a-input-password
                                        v-model="settingForm.appSecret"
                                        autocomplete="new-password"
                                        placeholder="请输入AppSecret"
                                    />
                                </a-form-model-item>
                                <a-form-model-item ref="aesKey" label="AesKey" prop="aesKey">
                                    <a-input-password
                                        v-model="settingForm.aesKey"
                                        autocomplete="new-password"
                                        placeholder="请输入aesKey"
                                    />
                                </a-form-model-item>
                                <a-form-model-item ref="publicCert" label="Public.cert" prop="publicCert">
                                    <a-input-password
                                        v-model="settingForm.publicCert"
                                        autocomplete="new-password"
                                        placeholder="请输入Public.cert"
                                    />
                                </a-form-model-item>
                                <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }" >
                                    <a-button type="primary">
                                      连接
                                    </a-button>
                                </a-form-model-item>
                            </a-form-model>
                      </div>
                      <div class="right-part">
                          <div style="font-size: 14px">返回结果：</div>
                          <div class="right-result"></div>
                      </div>
                  </div>
              </div>
            </a-tab-pane>
        </a-tabs>
    </a-drawer>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

const defaultKnow = () => ({
    knowledgeType: '01',
    knowledgeRange: ''
})

const defaultBasic = () => ({
    applicationName: '',
    explain: ''
})

const defaultSetting = () => ({
    address: '',
    appKey: '',
    appSerect: '',
    aesKey: '',
    publicCert: ''
})

@Component
export default class ApplicationDrawer extends Vue {
    @Prop({ default: false }) visible!: boolean;
    @Prop({ default: {} }) dataInfo!: any;
    @Prop({ default: '1' }) tabActiveKey!: any;

    twoToneColor: any = '#1D5EFF'
    activeKey: any = '1'
    labelCol = { span: 5 }
    wrapperCol = { span: 16 }
    condition: any = '001'
    knowledgeForm: any = defaultKnow()
    basicinfoForm: any = defaultBasic()
    settingForm: any = defaultSetting()
    knowledgeClassify: any = ''
    knowledgeLabel: any = ''
    autoExpandParent: any = true
    checkedKeys: any = []
    selectedKeys: any = []
    indeterminate: any = false
    checkAll: any = false
    checkedList: any = []
    knowledgeRules = {
        knowledgeType: [{ required: true, message: '请输入应用名称', trigger: 'change' }],
        knowledgeRange: [{ required: true, message: '请输入应用地址', trigger: 'change' }],
    }
    basicinfoRules = {
        applicationName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
    }
    settingRules = {
        address: [{ required: true, message: '请输入应用地址', trigger: 'blur' }],
        appKey: [{ required: true, message: '请输入AppKey', trigger: 'blur' }],
        appSecret:  [{ required: true, message: '请输入AppSecret', trigger: 'blur' }]
    }
    knowledgeRangeArr: any = [
        {
            code: '01',
            value: '全部'
        },
        {
            code: '02',
            value: '意图库'
        },
        {
            code: '03',
            value: '问答库'
        },
        {
            code: '04',
            value: '文档库'
        }
    ]
    treeData: any = [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-0',
            key: '0-0-0',
            children: [
              { title: '0-0-0-0', key: '0-0-0-0' },
              { title: '0-0-0-1', key: '0-0-0-1' },
              { title: '0-0-0-2', key: '0-0-0-2' },
            ],
          },
          {
            title: '0-0-1',
            key: '0-0-1',
            children: [
              { title: '0-0-1-0', key: '0-0-1-0' },
              { title: '0-0-1-1', key: '0-0-1-1' },
              { title: '0-0-1-2', key: '0-0-1-2' },
            ],
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '0-1',
        key: '0-1',
        children: [
          { title: '0-1-0-0', key: '0-1-0-0' },
          { title: '0-1-0-1', key: '0-1-0-1' },
          { title: '0-1-0-2', key: '0-1-0-2' },
        ],
      },
      {
        title: '0-2',
        key: '0-2',
      },
    ];
    plainOptions: any = ['标签一', '标签二', '标签三', '标签四']
    
    @Watch('checkedKeys', { deep: true })
    onCheckedKeysChange(val:any) {
        console.log('checkedKeys', val)
    }

    mounted(){
        console.log('safd')
        this.activeKey = '1'
    }

    editClose(){
        this.$emit('drawerClose', false)
    }

    saveSetting(){
        const h = this.$createElement;
        const _this = this
        this.$confirm({
            title: '修改调用知识范围提示',
            content: h('div', {}, [
                h('span', '您确定允许应用产品 '),
                h('span', {style: 'font-weight: 700;color: #212121;'}, _this.dataInfo.appId),
                h('span', ' 请求使用配置范围内的知识吗？提交后将即时生效'),
            ]),
            okText: '确认',
            cancelText: '取消',
            onOk(){
                _this.$message.success('修改知识范围成功')
            },
        });
    }

    lssueKnowledge(){
        const h = this.$createElement;
        const _this = this
        this.$confirm({
            title: '下发知识提示',
            content: h('div', {}, [
                h('span', '您确定要下发配置范围内的知识给应用产品 '),
                h('span', {style: 'font-weight: 700;color: #212121;'}, _this.dataInfo.appId),
                h('span', ' 吗？'),
            ]),
            okText: '确认',
            cancelText: '取消',
            onOk(){
                _this.$message.success('下发成功')
            },
        });
    }

    callback(key: any){
        this.activeKey = key
    }

    changeKnowledgeType(e: any){
        console.log('changeKnowledgeType', e.target.value)
    }

    conditionHandleChange(val:any, option:any){
        this.condition = val
        console.log('val, option', val, option)
    }

    onSearch(){
        console.log('搜索知识分类')
    }

    onChangeLabel(checkedList:any) {
        this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length;
        this.checkAll = checkedList.length === this.plainOptions.length;
        console.log('onChangeLabel', this.indeterminate, this.checkAll)
    }

    onCheckAllChange(e:any) {
        Object.assign(this, {
            checkedList: e.target.checked ? this.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
        console.log('onCheckAllChange', this.indeterminate, this.checkAll, this.checkedList)
    }

}
</script>

<style lang="less" scoped>
.drawer-head{
    margin-right: 30px;
    color: #2A2E32;
    font-weight: 600;
    .drawer-time{
        float: right;
        color: #2A2E32;
        font-size: 11px;
        font-weight: 200;
        margin-top: 3px;
    }
    .drawer-appId{
        float: right;
        margin-right: 30%;
        color: #2A2E32;
        font-size: 12px;
        font-weight: 200;
    }
    .drawer-status{
        float: right;
        margin-right: 5%;
        padding: 0 8px;
        color: #3B3B3B;
        font-size: 12px;
        font-weight: 300;
        background: #E5EDFF;
        border-radius: 7px;
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
.tips{
    font-size: 12px;
    margin-left: 5px;
    font-weight: 300;
}
.select-part{
    margin: 10px 0px 10px 2px;

    .select-part-word{
        margin: 10px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: rgba(42,46,50,0.80);
        line-height: 22px;
    }
    .select-part-content{
        background: #F5F8FD;
        margin: 20px;
        overflow: hidden;

        .top-search{
            margin: 10px;
        }
        .left-tree{
            float: left;
            padding-left: 12px;
            margin: 0 0 20px 0;
            border-right: 1px solid #E8EDF2;
            overflow: auto;
            width: 400px;
            height: 453px;
        }
        .right-tree{
            float: right;
            padding-left: 20px;
            overflow: auto;
            width: 400px;
            height: 473px;

            .label-group{
                display: inline-grid;
                line-height: 30px;
                margin-top: 10px;
            }
        }
    }
}
.tab-key2{
    .tab-key2-top{
        .tab-key2-tips{
            font-size: 14px;
            margin-left: 8px;
        }
    }
    .tab-key2-under{
        margin-top: 30px;
        .left-form{
            float: left;
            width: 400px;
        }
        .right-part{
            float: right;
            
            .right-result{
                width: 430px;
                height: 400px;
                margin: 4px 0 0 0;
                overflow: auto;
                background-color: azure;
            }
        }
    }
}
.tooltip-word{
    font-size: 12px;
}
</style>