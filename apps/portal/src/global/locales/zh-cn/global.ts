export default {
  enum: {
    themeMode: {
      light: '明亮',
      dark: '暗黑'
    }
  },
  action: {},
  label: {
    themeMode: '主题模式',
    languageSetting: '语言设置'
  },
  component: {
    input: {
      placeholder: '请输入'
    }
  },
  message: {}
} satisfies typeof import('../en-us/global').default
