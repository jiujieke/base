declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}
declare module '*.ts' {
  const content: any;
  export default content;
}
declare interface Window {
  createObjectURL: any;
  webkitURL: any;
  AudioContext: any;
  webkitAudioContext: any;
  hackForMozzila: any;
}
declare module 'ant-design-vue/lib/locale-provider/zh_CN';
declare module 'nprogress';