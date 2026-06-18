module.exports = {
  types: [
    { value: "feat", name: "feat: 增加新功能" },
    { value: "fix", name: "fix: 修复bug" },
  ],
  messages: {
    type: "请选择提交类型",
  },
  allowCustomScope: true,
  skipQuestions: ["body", "footer"],
  subjectLimit: 72,
};
