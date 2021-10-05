<template>
    <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
            <a-input :value="value" @change="handleChange" @pressEnter="check" :placeholder='placeholder' /><a-icon
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
export default class EditableName extends Vue {
    @Prop({ default: '' }) text!: string;
    @Prop({ default: 0 }) length!: number;
    @Prop({ default: '请输入' }) placeholder!: string;
    
    value: any = this.text
    editable: any = false
    error: any = false

    mounted(){
        // console.log('text', this.text)
    }
    
    handleChange(e: any) {
        const value = e.target.value;
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

.error-tip{
  color: #F56C6C;
  font-size: 12px;
}
</style>