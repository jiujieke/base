<template>
    <div>
        <a-drawer
            title="编辑意图"
            :width="!isFoldPreview ? 560 : 1210"
            :visible="visible"
            :mask-closable="false"
            @close="editClose"
        >
            <div class="drawer-content">
                <div class="drawer-form" :style="{'border-right': !isFoldPreview ? '':'1px solid #d9d9d9'}">
                    <a-form-model
                        ref="intentForm"
                        :model="form"
                        :rules="rules"
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                    >
                        <a-form-model-item ref="classify" label="知识分类" prop="classify">
                            <a-tree-select
                                v-model="form.classify"
                                :tree-data="treeData"
                                allow-clear
                                tree-default-expand-all
                                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                placeholder="请选择知识分类"
                            />
                        </a-form-model-item>
                        <a-form-model-item ref="tag" label="标签" prop="tag">
                            <a-select 
                                v-model="form.tag"
                                allow-clear
                                mode="multiple"
                                :max-tag-count="2"
                                placeholder="请选择标签"
                            >
                                <a-select-option v-for="item in labelList" :key="item.id" :value="item.id">
                                    {{ item.detail }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item ref="intentName" label="意图名称" prop="intentName">
                            <a-textarea
                                v-model="form.intentName"
                                :auto-size="{ minRows: 3, maxRows: 6 }"
                                :max-length='200'
                                placeholder="请输入意图名称，200字以内"
                            />
                            <a-tooltip :placement="!isFoldPreview ? 'topLeft' : 'top'" :get-popup-container="getPopupContainer">
                                <template slot="title">
                                    <div class="tooltip-word">1、意图名称，应用于机器语义识别训练；二次修改后将同时修改关联问答的问题，请谨慎填写及修改；</div>
                                    <div class="tooltip-word">2、系统所有意图按意图名称去重管理。</div>
                                </template>
                                <a-icon type="exclamation-circle" theme="twoTone" :two-tone-color="'#d3d3d3'" class="exclamation-icon" />
                            </a-tooltip>
                        </a-form-model-item>
                        <a-form-model-item ref="intentPre" label="意图预览" prop="intentPre">
                            <div class="intentPre-card">
                                <div><a-tag class="intentPre-tag">Tdcsfgrfgsdg的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsb的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsb的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsbgag 1</a-tag></div>
                                <div><a-tag class="intentPre-tag">Tag 2</a-tag></div>
                                <div><a-tag class="intentPre-tag">Tag 3</a-tag></div>
                                <div><a-tag class="intentPre-tag">Tag 4</a-tag></div>
                                <div><a-tag class="intentPre-tag">Tag 5</a-tag></div>
                                <div>
                                    <a-tag class="intentPre-tag">我要买 
                                        <a-tag color="blue">出发地：北京</a-tag>
                                        到
                                        <a-tag color="blue">目的地：广州</a-tag>
                                        的机票
                                    </a-tag>
                                </div>
                                <div class="clink-more">
                                    <a type="link" @click="goToMore">展开更多</a>
                                </div>
                            </div>
                        </a-form-model-item>
                    </a-form-model>
                </div>
                <div class="drawer-preview" v-if="isFoldPreview">
                        <h3 class="preview-header-label">关联问答</h3>
                    <div class="preview-header" >
                        <h4 class="preview-header-label">问题：</h4>
                        <div class="preview-header-detail">这是一个问题。这是一个问题。这是一个问题。这是一个问题。这是一个问题。这是一个问题。</div>
                    </div>
                    <div>
                        <div class="group-btn">
                            <a-button class="mar-right10" size="small" v-for="(item, index) in dataInfo.qa" :key="index" @click="goToCarousel(index)">{{ `回答${index + 1}`}}</a-button>
                        </div>
                        <div>
                            <a-carousel ref="varousel">
                                <div v-for="(item, index) in dataInfo.qa" :key="index" class="preview-header">
                                    <h4 class="preview-header-label">{{ `回答${index+1}：` }}</h4>
                                    <div class="preview-header-detail">{{item}}</div>
                                </div>
                            </a-carousel>
                        </div>
                        <div class="carousel-btn">
                            <a-button type="link" class="mar-right10" @click="prevCarousel"><a-icon type="left" />上一条</a-button>
                            <a-button type="link" @click="nextCarousel">下一条<a-icon type="right" /></a-button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom-btn">
                <a-button class="bottom-foldbtn" @click="checkPreview" :disabled="dataInfo.qa.length<1">
                    <a-icon type="double-left" v-show="!isFoldPreview" />
                    {{ !isFoldPreview ? '查看关联问答' : '收起关联问答'}}
                    <a-icon type="double-right" v-show="isFoldPreview" />
                </a-button>
                <a-button class="mar-right10" @click="editClose">
                  取消
                </a-button>
                <a-button type="primary" @click="handleOk">
                  确定
                </a-button>
            </div>

            <a-modal
                v-model="intentModalVisible"
                title="编辑意图"
                @ok="handleSave"
                :width="1200"
                okText="保存"
                :keyboard="false"
                :maskClosable="false"
                :destroyOnClose="true"
            >
                <div>
                    <span>意图名称：</span>
                    <a-input
                        v-model="modalIntentName"
                        class="widget"
                        placeholder="请输入意图名称"
                        :max-length='200'
                    />
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                            <div class="tooltip-word">二次修改后将同时修改关联问答的问题，请谨慎填写及修改</div>
                        </template>
                        <a-icon type="exclamation-circle" theme="twoTone" :two-tone-color="'#d3d3d3'" class="modal-exclamation-icon"/>
                    </a-tooltip>
                </div>
                <div class="editor-part">
                    <div class="left-corpus">
                        <div class="editor-top-div"><a-button type="dashed" class="editor-top-btn" @click="addCorpus"><a-icon type="plus" />添加拓展语料</a-button></div>
                        <div class="editor-content">
                            <div class="editor-list">
                                <div class="editor-total">
                                    共有5条拓展语料
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                            <div class="tooltip-word">复制全部拓展语料</div>
                                        </template>
                                    <a-icon type="copy" theme="twoTone" :two-tone-color="'#1D5EFF'" class="editor-copy-icon" />
                                    </a-tooltip>
                                </div>
                                <div class="editor-tag">
                                    <div><a-tag class="intentPre-tag" closable>Tdcsfgrfgsdg的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsb的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsb的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsbgag 1</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 2</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 3</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 3</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 4</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 5</a-tag></div>
                                    <div>
                                        <a-tag class="intentPre-tag" closable>我要买 
                                            <a-tag color="blue">出发地：北京</a-tag>
                                            到
                                            <a-tag color="blue">目的地：广州</a-tag>
                                            的机票
                                        </a-tag>
                                    </div>
                                </div>
                            </div>
                            <!-- <a-empty class="editor-empty" /> -->
                        </div>
                    </div>
                    <div class="center-line">
                    </div>
                    <div class="right-rule">
                        <div class="editor-top-div"><a-button type="dashed" class="editor-top-btn" @click="addRule"><a-icon type="plus" />添加规则表达式</a-button></div>
                        <div class="editor-content">
                            <div class="editor-list">
                                <div class="editor-total">
                                    共有5条规则表达式
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                            <div class="tooltip-word">复制全部规则表达式</div>
                                        </template>
                                    <a-icon type="copy" theme="twoTone" :two-tone-color="'#1D5EFF'" class="editor-copy-icon" />
                                    </a-tooltip>
                                </div>
                                <div class="editor-tag">
                                    <div><a-tag class="intentPre-tag" closable>Tdcsfgrfgsdg的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsb的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsb的沙发斯蒂芬斯蒂芬斯蒂芬味儿rsfsbgag 1</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 2</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 3</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 4</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 5</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 5</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 3</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 4</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 5</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 3</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 4</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 5</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 3</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 4</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 5</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 3</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 4</a-tag></div>
                                    <div><a-tag class="intentPre-tag" closable>Tag 5</a-tag></div>
                                </div>
                            </div>
                            <!-- <a-empty class="editor-empty" /> -->
                        </div>
                    </div>
                </div>
            </a-modal>

            <a-modal
                v-model="corpusVisible"
                :title="null"
                :closable="false"
                :width="556"
                :dialogStyle="{'margin': '120px 0 0 350px'}"
                :keyboard="false"
                :maskClosable="false"
                :destroyOnClose="true"
            >
                <div class="modal-content">
                    <div class="modal-recommend-btn">
                        <a-button type="link" @click="openRecommendCorpus">推荐语料</a-button>
                    </div>
                    <a-textarea
                        id='wangeditor-content'
                        placeholder="Controlled autosize"
                        :auto-size="{ minRows: 6, maxRows: 6 }"
                        v-model="wangeditorContent"
                    />
                    <div class="modal-recommend-select-open" v-show="isOpenRecommendCorpus">
                        <div style="padding: 10px 10px 0 10px">
                            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onRecommendCheckAllChange">
                                全选
                            </a-checkbox>
                            <div style="float:right">
                                <a-button type="link" style="padding:0 10px 0 0" @click="quoteRecommend">引用</a-button>
                                <a-button type="link" style="padding:0" @click="putawayRecommend">收起</a-button>
                            </div>
                        </div>
                        <a-checkbox-group class="modal-recommend-checkbox-group" :options="plainOptions" v-model="checkedRecommendList" @change="onRecommendChange" />
                    </div>
                    <div class="corpus-insert-div">
                        <span class="corpus-insert-span">提槽</span>
                        <a-popover
                            :title="null"
                            trigger="hover"
                            :visible="hovered"
                            @visibleChange="handleHoverChange"
                        >
                            <div slot="content" class="tooltip-word">
                                点击该按钮打开变量选择框，选择变量后将在光标处插入所需要的变量名
                            </div>
                            <a-popover
                                :title="null"
                                trigger="click"
                                :visible="clicked"
                                @visibleChange="handleClickChange"
                            >
                                <div slot="content" class="coapus-insert-list">
                                    <p v-for="item in corpusData" :key="item.key" @click="getCorpusWordset(item)" class="coapus-insert-var">
                                        {{ item.name }}
                                    </p>
                                </div>
                                <a-button type="link" style="height:22px"><a-icon type="plus-circle" theme="twoTone" @click="openInsertVar" /></a-button>
                            </a-popover>
                        </a-popover>
                    </div>
                    
                    <a-table
                        :columns="corpusColumns"
                        :data-source="corpusData"
                        :pagination="false"
                        :row-key="record => record.name"
                    >
                        <template slot="name" slot-scope="text, record">
                            <editable-name :length='10' :text="text" @change="onNameChange(record.key, 'name', $event)" :placeholder="'请输入变量名称'" />
                        </template>
                        <template slot="wordsetTitle">
                            关联词集
                            <a-tooltip placement="top">
                                <template slot="title">
                                    <div class="tooltip-word">使用@xxxxx引用同义词集</div>
                                    <div class="tooltip-word">使用$xxxxx引用同类词集</div>
                                </template>
                                <a-icon type="info-circle" class="modal-icon-base" style="margin-left:20px" />
                            </a-tooltip>
                        </template>
                        <template slot="wordsetContent" slot-scope="text, record">
                            <editable-wordset
                                :length='21'
                                :prefixlist="['@', '$']"
                                :prefixstr="'@'"
                                :text="text"
                                :data="MOCK_DATA"
                                @change="onWordsetChange(record.key, 'relateWordset', $event)"
                                :placeholder="'请输入关联词集'"
                            />
                        </template>
                        <!-- <template slot="importantWord" slot-scope="text, record">
                            <a-checkbox
                                v-model="record.importantWord"
                                @change="importantWordChange"
                            >
                            </a-checkbox>
                        </template> -->
                    </a-table>
                    <div style="text-align:end">
                        <a-button style="margin:10px" @click="addVariable"><a-icon type="plus" />添加变量</a-button>
                    </div>
                </div>
            </a-modal>

            <a-modal
                v-model="ruleVisible"
                :title="null"
                :closable="false"
                :width="566"
                :dialogStyle="{'margin': '120px 0 0 940px'}"
                :keyboard="false"
                :maskClosable="false"
                :destroyOnClose="true"
            >
                <div class="modal-content">
                    <div class="modal-recommend-btn">
                        <a-button type="link">推荐规则</a-button>
                    </div>
                    <a-mentions
                        placeholder="请输入规则表达式"
                        :prefix="['@', '$']"
                        @search="onRuleMentionSearch"
                        :rows="8"
                    >
                        <a-mentions-option v-for="item in MOCK_DATA[prefix] || []" :key="item.value" :value="item.value">
                            <div>
                                {{ item.value }}
                                <div class="mentions-endword">{{ item.type + '(' + item.num + ')'}}</div>
                            </div>
                        </a-mentions-option>
                        <a-mentions-option @select="addWordset" value="">
                            <a-button type="link" @click="addWordset('@')" v-if="prefix === '@'">+新增同义词词集</a-button>
                            <a-button type="link" @click="addWordset('$')" v-if="prefix === '$'">+新增同类词词集</a-button>
                        </a-mentions-option>
                    </a-mentions>
                    <div class="rule-tooltip-icon">
                        <a-tooltip placement="top">
                            <template slot="title">
                                <div class="tooltip-word">以xxx表示内容，英文符号表示规则：</div>
                                <div class="tooltip-word">(xxx)：圆括号中的内容必须出现</div>
                                <div class="tooltip-word">[xxx]：方括号中的内容可出现也可不出现</div>
                                <div class="tooltip-word">!xxx：感叹号后的内容不能出现</div>
                                <div class="tooltip-word">@xxx：引用同义词xxx</div>
                                <div class="tooltip-word">$xxx：引用同类词xxx</div>
                                <div class="tooltip-word">xxx|yyy：二者任取其一</div>
                                <div class="tooltip-word">{(xxx)(yyy)}：大括号内的数据必须按顺序出现</div>
                                <div class="tooltip-word">/x/：x为自然数，表示此处可以额外支持的字符数上限</div>
                                <div class="tooltip-word">/x,y/：x、y为自然数，表示此处可额外支持的字符数区间</div>
                            </template>
                            <a-icon type="info-circle" class="modal-icon-base" />
                        </a-tooltip>
                    </div>
                </div>
            </a-modal>
        </a-drawer>

    </div>
    
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EditableName from '@/components/common/editableInput.vue'
import EditableWordset from '@/components/common/editableMentions.vue'

const defaultForm = () => ({
    classify: [],
    tag: [],
    intentName: '',
    intentPre: '',
})

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

const MOCK_DATA = {
    '@': [
        {
            value: '中国城市',
            type: '通用',
            num: '50'
        },
        {
            value: '中国方言',
            type: '本流程',
            num: '2150'
        },
        {
            value: '中国菜系',
            type: '通用',
            num: '51'
        }
    ],
    '$': [
        {
            value: '美年达',
            type: '通用',
            num: '50'
        },
        {
            value: '苹果河',
            type: '本流程',
            num: '1250'
        },
        {
            value: '华强北',
            type: '通用',
            num: '51'
        }
    ],
};

const corpusColumns = [
  {
    title: '变量名称',
    dataIndex: 'name',
    key: 'name',
    width: 190,
    scopedSlots: { customRender: 'name' },
  },
  {
    dataIndex: 'relateWordset',
    key: 'relateWordset',
    width: 310,
    slots: { title: 'wordsetTitle' },
    scopedSlots: { customRender: 'wordsetContent' },
  },
//   {
//     title: '设为重点词',
//     dataIndex: 'importantWord',
//     key: 'importantWord',
//     width: 150,
//     scopedSlots: { customRender: 'importantWord' },
//   },
]

@Component({
    components: {
        'editable-name': EditableName,
        'editable-wordset': EditableWordset
  },
})
export default class IntentDrawer extends Vue {
    @Prop({ default: false }) visible!: boolean;
    @Prop({ default: {} }) dataInfo!: any;

    isFoldPreview: any = false
    form:any = defaultForm()
    treeData: any = treeData
    labelList: any = labelList
    labelCol = { span: 4 }
    wrapperCol = { span: 17 }
    intentModalVisible: any = false
    modalIntentName: any = ''
    corpusVisible: any = false
    ruleVisible: any =false
    MOCK_DATA: any = MOCK_DATA
    prefix: any = '@'
    corpusColumns: any = corpusColumns
    count:any = 102
    clicked: any = false
    hovered: any = false
    wangeditorContent: any = ''
    selectionNum: any = 0
    isOpenRecommendCorpus: any = false
    checkedRecommendList: any = []
    indeterminate: any = false
    checkAll: any = false
    plainOptions: any = [
        {
            label: '推荐语料一',
            value: '111'
        },
        {
            label: '推荐语料二',
            value: '222'
        },
        {
            label: '推荐语料三',
            value: '333'
        },
        {
            label: '推荐语料4',
            value: '444'
        },
        {
            label: '推荐语料5',
            value: '555'
        }
    ]
    corpusData: any = [
        {
            key: 100,
            name: '出发地',
            relateWordset: '@中国城市',
            importWord: 1
        },
        {
            key: 101,
            name: '目的地',
            relateWordset: '@中国城市',
            importWord: 1
        },
    ]
    rules = {
      classify: [{ required: true, message: '请选择知识分类', trigger: 'change' }],
      tag: [{ required: true, message: '请选择标签', trigger: 'change' }],
      intentName:  [{ required: true, message: '请输入意图名称，200字以内', trigger: 'blur' }]
    }

    checkPreview(){
        this.isFoldPreview = !this.isFoldPreview
    }

    handleOk(){
        (this.$refs.intentForm as any).validate((valid:any) => {
            if (valid) {
                console.log('form', this.form.classify, this.form.tag, this.form.intentName)
                this.editClose()
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }

    goToMore(){
        this.intentModalVisible = true
    }

    editClose(){
        this.$emit('drawerClose', false)
    }

    getPopupContainer() {
        return document.querySelector('.drawer-form');
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
    handleSave(){
        console.log('保存')
    }
    addCorpus(){
        this.corpusVisible = true
    }
    addRule(){
        this.ruleVisible = true
    }
    onRuleMentionSearch(_: any, prefix: any) {
      console.log(_, prefix);
      this.prefix = prefix;
    }
    openRecommendCorpus(){
        console.log('打开推荐语料浮窗')
        this.isOpenRecommendCorpus = !this.isOpenRecommendCorpus
    }
    openInsertVar(){
        console.log('打开插入变量浮窗')
        this.clicked = true
    }
    // importantWordChange(e: any){
    //     console.log(`checked = ${e.target.checked}`);
    // }
    onNameChange(key: any, dataIndex: any, value: any) {
        const corpusData = [...this.corpusData];
        const target = corpusData.find(item => item.key === key);
        if (target) {
            target[dataIndex] = value;
            this.corpusData = corpusData;
        }
    }
    onWordsetChange(key: any, dataIndex: any, value: any) {
        const corpusData = [...this.corpusData];
        const target = corpusData.find(item => item.key === key);
        if (target) {
            target[dataIndex] = value;
            this.corpusData = corpusData;
        }
    }
    addVariable() {
      const { count, corpusData } = this;
      const newData = {
        key: count,
        name: `FVD市场${count}`,
        relateWordset: '@中国方言',
      };
      this.corpusData = [...corpusData, newData];
      this.count = count + 1;
    }
    handleHoverChange(visible: any) {
      this.clicked = false;
      this.hovered = visible;
    }
    handleClickChange(visible: any) {
      this.clicked = visible;
      this.hovered = false;
    }
    getCorpusWordset(data: any){
        console.log('insert', data)
        this.clicked = false
        this.selectionNum = this.getCursortPosition(document.getElementById('wangeditor-content'))
        this.wangeditorContent = this.wangeditorContent.slice(0, this.selectionNum) + data.relateWordset + this.wangeditorContent.slice(this.selectionNum, this.wangeditorContent.length)
    }
    // 获取光标位置函数
    getCursortPosition(ctrl: any) {
      let CaretPos = 0;
      // IE Support
      if ((document as any).selection) {
        ctrl.focus();
        const Sel = (document as any).selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
      }
      // Firefox support
      else if (ctrl.selectionStart || ctrl.selectionStart === '0') CaretPos = ctrl.selectionStart;
      return CaretPos;
    }
    onRecommendCheckAllChange(e: any){
        console.log('e', e)
        Object.assign(this, {
          indeterminate: false,
          checkAll: e.target.checked,
        });
        if(e.target.checked){
            this.plainOptions.forEach(item => {
                this.checkedRecommendList.push(item.value)
            });
        }else{
            this.checkedRecommendList = []
        }
    }
    onRecommendChange(){
        this.indeterminate = !!this.checkedRecommendList.length && this.checkedRecommendList.length < this.plainOptions.length;
        this.checkAll = this.checkedRecommendList.length === this.plainOptions.length;
    }
    quoteRecommend(){
        console.log('引用推荐语料', this.checkedRecommendList)
        if(this.checkedRecommendList.length){
            this.putawayRecommend()
        }else{
            this.$message.warning('推荐语料不能为空！')
        }
        
    }
    putawayRecommend(){
        this.isOpenRecommendCorpus = false
    }
    addWordset(){
        console.log('addWordset')
    }
}
</script>

<style lang="less" scoped>
.drawer-content{
    background-color: azure;

    .drawer-form{
        width: 520px;
        min-height: 300px;
        float: left;
        overflow: auto;
        // background-color: aqua;
    }
    .drawer-preview{
        width: 630px;
        height: 300px;
        float: right;
        padding-left: 30px;
        // background-color: aquamarine;
    }
}
.intentPre-card{
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    padding: 4px 4px 0 4px;
}
.intentPre-tag{
    padding: 6px;
    margin: 6px;
    white-space: break-spaces;
}
.clink-more{
    text-align: center;
}
.bottom-btn{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
    z-index: 1;
    .bottom-foldbtn{
        float: left;
    }
}
.mar-right10{
    margin-right: 10px;
}
.exclamation-icon{
    float: right;
    margin-right: -2rem;
    margin-top: 0.4rem;
}
.modal-exclamation-icon{
    margin-left: 8px;
    font-size: 18px;
}
.tooltip-word{
    font-size: 12px;
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
.carousel-btn{
    text-align: end;
}
.widget {
    width: 520px;
    flex: 0 0 240px;
}
.editor-part{
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
    height: 500px;
}
.left-corpus{
    width: 550px;
    // overflow: auto;
    // background-color: beige;
}
.center-line{
    width: 1px;
    background-color: #d3d3d3;
}
.right-rule{
    width: 550px;
    overflow: auto;
    // background-color: burlywood;
}
.editor-top-div{
    text-align: center;
}
.editor-top-btn{
    width: 95%;
}
.editor-empty{
    margin-top: 100px;
}
.editor-total{
    margin-top: 14px;
    margin-left: 14px;
}
.editor-copy-icon{
    float: right;
    margin-right: 14px;
    font-size: 18px;
}
.editor-tag{
    margin: 8px;
    max-height: 410px;
    overflow: auto;
}
.modal-recommend-btn{
    text-align: end;
}
.modal-recommend-select-open{
    position: absolute;
    z-index: 10;
    background-color: #F5F7FA;
    width: 400px;
    max-height: 120px;
    overflow: auto;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    margin: 1px 42px;
}
.modal-recommend-checkbox-group{
    display: inline-grid;
    padding: 0 10px 10px 10px;
}
.rule-tooltip-icon{
    text-align: end;
}
.modal-content{
    height: 480px;
    overflow: auto;
}
.mentions-endword{
    float:right;
    margin-left:40px;
    width:64px;
    font-size:12px;
    font-weight:200
}
.corpus-insert-div{
    text-align: end;
    margin-top: 10px;
}
.corpus-insert-span{
    float: left;
    color: black;
    font-weight: 600;
    font-size: 16px;
}
.coapus-insert-list{
    max-height: 150px;
    overflow: auto;
}
.coapus-insert-var:hover{
    color: #1D5EFF;
    background-color: #F0F4F8;
    cursor: default;
}
.modal-icon-base{
    margin-top: 10px;
    font-size: 16px;
}

.ant-carousel /deep/ .slick-slide {
    min-height: 160px;
    max-height: 300px;
    overflow: auto;
}

.ant-carousel /deep/ .slick-slide {
  color: black;
}
</style>