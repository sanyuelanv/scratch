'use strict'
import React from 'react'
import style from './index.css'
import scratch from './scratch'
class App extends React.Component {
  componentDidMount(){this._drawCanvas()}
  componentDidUpdate(){this._drawCanvas()}
  _drawCanvas(){
    var canvas = document.getElementById('canvas')
    if(canvas){
      scratch(canvas,{
        text:"哈哈哈哈",  //上面的文字
        size:{w:200,h:500}, // 刮刮乐的尺寸
        //scale:window.screen.width / 750,  ／／比例变化
        scale:1,
        offset:{x:20,y:50,},  //以右上角为原点的x,y距离
        // slideDiv:document.getElementById('box') ／／最外层可以垂直滚动
        slideDiv:null,
        bg:"#BCBCBC", //背景颜色
        font:{  //字体属性
          size:40,
          color:"#959595",
        },
        precent:0.5, //刮开到多少百分比的时候完全刮开
        lineWidth:60, //画笔的大小

      })
    }

  }
  render() {
    return (
      <div className={style.app} >
        <div className={style.box} >
          <canvas className={style.canvas} id="canvas" ></canvas>
        </div>
      </div>
    )
  }
}

export default App
