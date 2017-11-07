
import eventUtil from './eventUtil'
import roundedRect from './roundedrect'

var index = 0
var canvasDraw = function(canvas,config){
  const WIDTH = config.size.w
  const HEIGHT = config.size.h
  const scale = config.scale
  const slideDiv = config.slideDiv
  const offset = {
    top:config.offset.y,
    left:config.offset.x,
  }
  let ctxt = canvas.getContext("2d")
  canvas.width = WIDTH
  canvas.height = HEIGHT
  ctxt.fillStyle = config.bg
  roundedRect(ctxt,0,0,WIDTH,HEIGHT,25)
  ctxt.fillStyle = config.font.color
  ctxt.font = config.font.size + "px PingFangSC-Medium"
  ctxt.textAlign = "center"
  ctxt.textBaseline = "middle"
  ctxt.fillText(config.text,WIDTH/2, HEIGHT/2)
  //
  var lines = []
  var allArea = WIDTH * HEIGHT
  var precent = config.precent
  var isOver = false
  /*这里用globalCompositeOperation而不是clearRect来做橡皮擦功能，主要为touchstart是画圆*/
  ctxt.globalCompositeOperation="destination-out";
  ctxt.globalAlpha =1;
  /*初始化一些数据:为了圆角和交角圆形*/
  ctxt.lineCap = "round";
  ctxt.lineJoin = "round";
  ctxt.lineWidth = 40;
  // 移动
  var move = function( i, changeX, changeY ) {
    ctxt.beginPath();
    ctxt.moveTo( lines[ i ].x, lines[ i ].y );
    ctxt.lineTo( lines[ i ].x + changeX, lines[ i ].y + changeY );
    ctxt.stroke();
    ctxt.closePath();
    calculate();
    return {
      x: lines[ i ].x + changeX,
      y: lines[ i ].y + changeY
    }
  }
  // 绑定手势事件
  var touchstartEvent = (event)=>{
    for ( var i = 0; i < event.touches.length; i++ ) {
      var touch = event.touches[ i ];
      var id = touch.identifier;
      lines[ id ] = {
        x: parseInt(touch.pageX/scale) - offset.left,
        y: parseInt(touch.pageY/scale) - offset.top
      }
      if(slideDiv){
        lines[ id ].y  = lines[ id ].y + slideDiv.scrollTop
      }

      ctxt.beginPath();
      ctxt.arc( lines[ id ].x, lines[ id ].y, ctxt.lineWidth,0, Math.PI * 2, true );
      ctxt.closePath();
      ctxt.fill();
      calculate();
    };
    event.preventDefault();
  }
  var touchmoveEvent = (event)=>{
    for ( var i = 0; i < event.touches.length; i++ ) {
      var touch = event.touches[ i ];
      var id = touch.identifier;
      var moveX = parseInt(touch.pageX/scale) - offset.left - lines[ id ].x;
      var moveY = parseInt(touch.pageY/scale) - offset.top  - lines[ id ].y;
      if(slideDiv){
        moveY = moveY + slideDiv.scrollTop
      }
      var ret = move( id, moveX, moveY );
      lines[ id ].x = ret.x;
      lines[ id ].y = ret.y;
    };
    event.preventDefault();
  }
  // 计算是否结束
  var calculate = ( l ) => {
    if(precent==-1 || isOver){return;}
    var area = 0;
    var imageData = ctxt.getImageData( 0, 0, canvas.width, canvas.height )
    for ( var i = 0, ii = imageData.data.length; i < ii; i = i + 4 ) {
      if ( imageData.data[ i ] === 0 && imageData.data[ i + 1 ] === 0 && imageData.data[ i + 2 ] === 0 && imageData.data[ i + 3 ] === 0 ) {area++;}
    }
    if ( area / allArea > precent ) {
      isOver = true
      ctxt.clearRect( 0, 0, canvas.width, canvas.height )
    }
  }
  // 防止事件多次绑定
  if(index == 0){
    eventUtil.on(canvas,"touchstart",touchstartEvent)
    eventUtil.on(canvas,"touchmove",touchmoveEvent)
    index++
  }
  else {
    eventUtil.off(canvas,"touchstart",touchstartEvent)
    eventUtil.off(canvas,"touchmove",touchmoveEvent)
    eventUtil.on(canvas,"touchstart",touchstartEvent)
    eventUtil.on(canvas,"touchmove",touchmoveEvent)
  }
}
export default canvasDraw
