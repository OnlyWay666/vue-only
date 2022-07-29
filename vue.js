class Vue {
  constructor(options) {
    this.$el = document.querySelector(options.el);
    this.$data = options.data;
    console.log(this.$el);
    this.compile(this.$el);
  }

  compile(node) {
    node.childNodes.forEach((item, index) => {
      //如果是文本节点，就把{{ }}里面的内容替换成数据
      if (item.nodeType == 1) {
        this.compile(item);
      }
      if (item.nodeType == 3) {
        // 正则匹配 {{}}
        let reg = /\{\{(.*?)\}\}/g;
        console.log(item);
        let text = item.textContent;
        // 赋值
        item.textContent = text.replace(reg, (match, vmKey) => {
          vmKey = vmKey.trim();
          return this.$data[vmKey];
        });
      }
    });
  }
}
