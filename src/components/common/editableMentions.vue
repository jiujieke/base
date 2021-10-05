<template>
    <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
            <a-mentions
                :value="value"
                :prefix="prefixlist"
                :placeholder="placeholder"
                @pressEnter="check"
                @change="handleChange"
                @search="onRuleMentionSearch"
                :max-length='21'
            >
                <a-mentions-option v-for="item in data[prefix] || []" :key="item.value" :value="item.value">
                    <div>
                        {{ item.value }}
                        <div class="mentions-endword">{{ item.type + '(' + item.num + ')'}}</div>
                    </div>
                </a-mentions-option>
            </a-mentions>
            <a-icon
                type="check"
                class="editable-cell-icon-check"
                @click="check"
            />
            <span v-if="error" class="error-tip">输入限制{{length}}个字</span>
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EditableWordset extends Vue {
    @Prop({ default: '' }) text!: string;
    @Prop({ default: [] }) data!: any;
    @Prop({ default: 0 }) length!: number;
    @Prop({ default: [] }) prefixlist!: any;
    @Prop({ default: '' }) prefix!: string;
    @Prop({ default: '请输入' }) placeholder!: string;
    
    
    value: any = this.text
    editable: any = false
    error: any = false

    mounted(){
        // console.log('text', this.data)
    }
    
    handleChange(e: any) {
        const value = e;
        this.value = value;
    }

    check() {
      if(this.value.length > this.length){
        this.error = true
      }else{
        this.error = false
        this.editable = false;
        this.$emit('change', this.value);
      }
    }

    edit() {
        this.editable = true;
    }
    
    onRuleMentionSearch(_: any, prefix: any) {
        this.prefix = prefix;
    }
}
</script>

<style lang="less" scoped>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.mentions-endword{
    float:right;
    margin-left:40px;
    width:64px;
    font-size:12px;
    font-weight:200
}
.error-tip{
  color: #F56C6C;
  font-size: 12px;
}
</style>