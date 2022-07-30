class Vue {
  constructor(options) {
    this.$options = options;

    this.$watchEvent = {};

    if (typeof options.beforeCreate == "function") {
      options.beforeCreate.bind(this)();
    }
    // 这是dota
    this.$data = options.data;
    // 数据劫持
    this.proxyData();
    this.observe();
    if (typeof options.created == "function") {
      options.created.bind(this)();
    }
    if (typeof options.beforeMount == "function") {
      options.beforeMount.bind(this)();
    }
    // 这是节点
    this.$el = document.querySelector(options.el);
    // 解析模板
    this.compile(this.$el);
    if (typeof options.mounted == "function") {
      options.mounted.bind(this)();
    }
  }
  // 1.给Vue对象赋来自data中的属性
  // 2.data中的属性和Vue对象的属性保持双向（数据劫持）
  proxyData() {
    for (let key in this.$data) {
      Object.defineProperty(this, key, {
        get() {
          return this.$data[key];
        },
        set(val) {
          this.$data[key] = val;
        },
      });
    }
  }

  // 触发data中的数据发生变化来执行Watcher中的updata
  observe(){
    for(let key in this.$data){
      let value = this.$data[key];
      let that = this;
      Object.defineProperty(this.$data,key,{
        get(){
          return value;
        }, 
        set( val){
          value = val;
          console.log('ddd')
          if( that.$watchEvent[key]){
            that.$watchEvent[key].forEach((item,index)=>{
              console.log('eee')
              item.updata;
            })
          }
        }
      })
    }
  }

  compile(node) { 
    node.childNodes.forEach((item,index) => {
      //如果是元素节点，就继续递归解析
      if (item.nodeType == 1) {
        // 判断元素节点是否绑定了@Click
        if (item.hasAttribute("@click")) {
          let vmKey = item.getAttribute("@click").trim();
          item.addEventListener("click", (event) => {
            this.eventFn = this.$options.methods[vmKey].bind(this);
            this.eventFn(event);
          });
        }

        if (item.childNodes.length > 0) {
          this.compile(item);
        }
      }
      //如果是文本节点，就把{{ }}里面的内容替换成数据
      if (item.nodeType == 3) {
        // 正则匹配 {{}}
        let reg = /\{\{(.*?)\}\}/g;
        let text = item.textContent;
        // 赋值
        item.textContent = text.replace(reg, (match, vmKey) => {
          vmKey = vmKey.trim();
          if( this.hasOwnProperty(vmKey)){
            
            let watcher = new Watcher(this, vmKey,item,'textContent')
            if(this.$watchEvent[vmKey]){
              this.$watchEvent[vmKey].push(watcher);
              console.log('aaaa')
            }else{
              this.$watchEvent[vmKey] = [];
              this.$watchEvent[vmKey].push(watcher);
              console.log('bbb')
            }
          }
          
          return this.$data[vmKey];
        });
      }
    });
  }
}

class Watcher{
  constructor(vm,key,node,attr){
    //对象
    this.vm = vm
    this.key = key;
    this.node = node;
    this.attr = attr
  }
  updata(){
    this.node[this.attr] = this.vm[this.key]
  }
}