<template>
    <div class="container">
        <h1 class="title">
            知识发布
            <a-tooltip placement="right">
                <template slot="title">
                    <div class="tooltip-word">1、用于发布更新正式环境数据，发布至正式环境后才可被各应用端使用；</div>
                    <div class="tooltip-word">2、系统将自动过滤已禁用的知识，不会发布至正式环境，请在发布前检查知识的启用情况</div>
                </template>
                <a-icon type="question-circle" theme="twoTone" :two-tone-color="'#d3d3d3'" style="margin-left: 4px;font-size:16px" />
            </a-tooltip>
        </h1>

        <div class="filter-row">
            <div class="filter-row-left">
                <div class="filter-item">
                    <div class="filter-label">发布时间：</div>
                    <a-range-picker @change="onChangeDateRange" />
                </div>
            </div>
            
            <div class="filter-row-right">
                <a-button
                    type="primary"
                    @click="send2prod"
                    >发布至正式环境</a-button
                >
            </div>
        </div>

        <div class="main">
            <a-table
                :columns="columns"
                :row-key="record => record.uuid"
                :data-source="dataSource"
                style="width:100%"
                :pagination="false"
                @change="handleTableChange"
            >
                <template slot="status" slot-scope="text, record">
                    {{
                        record.releaseStatus === '01'
                            ? '发布中'
                            : record.releaseStatus === '02'
                            ? '完成'
                            : record.releaseStatus === '03'
                            ? '已终止'
                            : '-'
                    }}
                </template>
                <template slot="action" slot-scope="text, record">
                    <a-popconfirm
                        v-if="record.releaseStatus !== '01'"
                        title="确认要删除该记录吗？删除后数据无法恢复"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="deleteRecord(record)"
                    >
                        <a href="#">删除记录</a>
                    </a-popconfirm>
                    <a-button type="link" v-else style="color: red;padding:0" @click="abort(record)">终止发布</a-button>
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
            v-model="releaseVisible"
            :width='600'
            title="发布至正式环境"
            ok-text="开始发布"
            cancel-text="取消"
            :maskClosable='false'
            @ok="handleRelease"
            @cancel="handleCancle"
            :mask-closable='false'
        >
            <div class="modal-top">
                <a-icon type="exclamation-circle" theme="twoTone" :two-tone-color="twoToneColor" />
                <span class="tips">系统将自动过滤已禁用的知识，不会发布至正式环境</span>
            </div>
            <a-form-model
                ref="releaseForm"
                :model="releaseForm"
                :rules="releaseRules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
                <a-form-model-item ref="editionName" label="版本" prop="editionName">
                    <a-input
                        v-model="releaseForm.editionName"
                        :max-length='20'
                        placeholder="请输入版本名称"
                    />
                </a-form-model-item>
                <a-form-model-item ref="describe" label="描述" prop="describe">
                    <a-textarea
                        v-model="releaseForm.describe"
                        :auto-size="{ minRows: 3, maxRows: 6 }"
                        :max-length='200'
                        placeholder="请输入描述，200个字以内"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

const columns = [
  {
    title: '版本',
    dataIndex: 'edition',
    width: '10%',
  },
  {
    title: '描述',
    dataIndex: 'describe',
    width: '23%',
  },
  {
    title: '发布人',
    dataIndex: 'releasePer',
    width: '10%',
  },
  {
    title: '发布时间',
    sorter: true,
    dataIndex: 'releaseTime',
    width: '20%',
  },
  {
    title: '发布状态',
    dataIndex: 'releaseStatus',
    scopedSlots: { customRender: 'status' },
    width: '10%',
  },
  {
    title: '发布知识数',
    dataIndex: 'releaseNum',
    width: '10%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: '12%',
  },
];

const defaultRelease = () => ({
    editionName: '',
    describe: '',
})

@Component
export default class Release extends Vue {
    twoToneColor: any = '#1D5EFF'
    columns: any = columns
    page: any = 1;
    total: any = 231;
    releaseVisible: any = false
    labelCol = { span: 3 };
    wrapperCol = { span: 19 };
    releaseForm: any = defaultRelease()
    releaseRules = {
      editionName:  [{ required: true, message: '请输入版本名称', trigger: 'blur' }]
    }
    // pagination: any = {
    //     position:'bottom',
    //     pageSize: 10,
    //     current: 1,
    //     total: 0,
    //     showQuickJumper: true,
    //     showTotal: total => `共 ${total} 条`
    // }
    dataSource: any = [
        {
            uuid: '1231244t33',
            edition: 'V3.0',
            describe: '描述吧数发部地方',
            releasePer: '发布人1号',
            releaseTime: '2021-09-23 12:00:00',
            releaseStatus: '01',
            releaseNum: '10w'
        },
        {
            uuid: '1231244t22',
            edition: 'V2.0',
            describe: '描述吧数发部地方',
            releasePer: '发布人1号',
            releaseTime: '2021-08-23 12:00:00',
            releaseStatus: '02',
            releaseNum: '22w'
        },
        {
            uuid: '1231244t23',
            edition: 'V1.0',
            describe: '描述吧数发部地方',
            releasePer: '发布人1号',
            releaseTime: '2021-07-23 12:00:00',
            releaseStatus: '03',
            releaseNum: '5w'
        }
    ]

    
    onPageChange(val:any){
        this.page = val;
    }

    handleTableChange(pagination:any, filters:any, sorter:any){
        console.log('pagination, filters, sorter', pagination, filters, sorter)
    }

    send2prod(){
        console.log('send2prod', '发布至生产环境')
        this.releaseVisible = true
    }

    onChangeDateRange(date:any, dateString:any){
        console.log(date, dateString);
    }

    deleteRecord(record:any) {
      console.log('deleteRecord', record);
      this.$message.success('删除成功');
    }

    abort(record:any){
        console.log('abort', record);
        const _this = this
        this.$confirm({
            title: '终止发布提示',
            content: '确认要终止本次发布吗？终止后本次发布失效，正式环境数据无更新',
            okText: '确定终止',
            cancelText: '取消',
            onOk(){
                _this.$message.success('已终止发布')
            },
        });
    }

    handleRelease(){
        console.log('发布...')
        this.handleCancle()
    }

    handleCancle(){
        this.releaseVisible = false;
        (this.$refs.releaseForm as any).resetFields();
    }

}
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding: 10px;
    flex-direction: column;
    display: flex;
    min-height: calc(100vh - 96px);
    
    .title{
        color: #2A2E32;
        font-size: 20px;
        padding: 12px 24px;
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
        .widget {
            width: 240px;
            flex: 0 0 240px;
        }
    }

    .main{
        flex: 1 1 auto;
        display: flex;
        overflow: hidden;
        padding: 20px;
    }

    .footer{
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }
    
}
.modal-top{
    margin: 15px;
}
.tips{
    margin-left: 6px;
}
.tooltip-word{
    font-size: 12px;
}
</style>