class Vue {
  constructor(options) {

    if( typeof options.beforeCreate == 'function'){
      options.beforeCreate.bind(this)()
    } 
    // 这是dota
    this.$data = options.data;
    if( typeof options.created == 'function'){
      options.created.bind(this)()
    }
    if( typeof options.beforeMount == 'function'){
      options.beforeMount.bind(this)()
    }
    // 这是节点
    this.$el = document.querySelector(options.el);
    // 解析模板
    this.compile(this.$el);
    if( typeof options.mounted == 'function'){
      options.mounted.bind(this)()
    }
  }

  compile(node) {
    node.childNodes.forEach((item) => {
      //如果是其他节点，就继续递归解析
      if (item.nodeType == 1) {
        this.compile(item);
      }
      //如果是文本节点，就把{{ }}里面的内容替换成数据
      if (item.nodeType == 3) {
        // 正则匹配 {{}}
        let reg = /\{\{(.*?)\}\}/g;
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
