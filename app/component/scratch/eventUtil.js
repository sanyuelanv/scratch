var EventUtil={};
function EventManage(){
  this.handlers={}
}
EventManage.prototype={
  on:function(type,handler){
    if(!this.handlers[type]){
      this.handlers[type]=[handler];
      return true;  //避免添加多个事件
    }else{
      this.handlers[type].push(handler);
    }
  },
  off:function(type,handler){
    for(var i=0,len=this.handlers[type].length;i<len;i++){
      if(this.handlers[type][i].toString()==handler.toString()){
        // console.log(handler);
        this.handlers[type].splice(i,1);
      }
    }
  }
}
EventUtil.on=function(ele,type,handler){
  if (!ele.event) {
    ele.event=new EventManage();
  }
  var isNewType=ele.event.on(type,handler);
  var fire=function(e){
      for(var i=0,len=ele.event.handlers[type].length;i<len;i++){
        ele.event.handlers[type][i](e);
      }
    };
  if (isNewType) {
    if (ele.addEventListener) {
      ele.addEventListener(type,fire,false);
    }else{
      ele.attachEvent("on"+type,fire);
    }
  }
}
EventUtil.off=function(ele,type,handler){
  ele.event.off(type,handler);
}

export default EventUtil
