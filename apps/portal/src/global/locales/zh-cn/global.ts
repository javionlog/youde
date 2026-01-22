export default {
  enum: {
    themeMode: {
      light: '明亮',
      dark: '暗黑'
    },
    fee: {
      free: '免费',
      partlyFree: '部分免费',
      paid: '付费'
    }
  },
  action: {
    reset: '重置'
  },
  label: {
    themeMode: '主题模式',
    languageSetting: '语言设置',
    noLimit: '不限',
    noDate: '无数据',
    category: '分类',
    fee: '费用'
  },
  component: {
    input: {
      placeholder: '请输入'
    }
  },
  message: {}
} satisfies typeof import('../en-us/global').default
