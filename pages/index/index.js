// index.js
// 获取应用实例
const app = getApp()
import {formatTime} from '../../utils/util'

Page({
  data: {
  showclock:false,
  clockheight:0,
  time:'25',
  mtime:300000,
  timestr:'25:00',
  cateactive:0,
  rate:'',
  backshow:false,
  pauseshow:true,
  continueshow:false,
  timer:null,
  cateArr:[
      {
        icon:'work',
        text:'工作',
      },
      {
        icon:'study',
        text:'学习',

      },
      {
        icon:'think',
        text:'思考',

      },
      {
        icon:'write',
        text:'写作',

      },
      {
        icon:'sport',
        text:'运动',

      },
      {
        icon:'read',
        text:'阅读',

      },
   ]
  },

  onLoad:function(){
    var res = wx.getSystemInfoSync();
    let rate = 750 / res.windowWidth;
    // console.log(rate);
    this.setData({
      rate: rate,
      clockheight:rate * res.windowHeight
    })
   
  },
  sliderChange:function(e){
      // console.log(e);
      this.setData({
         time:e.detail.value
      })
  },


  clickmission:function(e){
    // console.log(e);
    this.setData({
      cateactive:e.currentTarget.dataset.index
    })
  },
  start:function(){
   this.setData({
     showclock:true,
     mtime:this.data.time*60*1000,
     timestr:this.data.time >= 10 ? this.data.time + ':00' : '0'+this.data.time + ':00'
   })
   this.draw();
   this.drawact();
  },

  draw:function(){
    var lineWidth = 6/this.data.rate;
    const query = wx.createSelectorQuery()
    query.select('#clock-bg')
        .fields({ node:true, size: true})
        .exec(res => {
           const canvas = res[0].node;
           const ctx = canvas.getContext('2d');
           const dpr = wx.getSystemInfoSync().pixelRatio;
           canvas.width = res[0].width * dpr;
           canvas.height = res[0].height * dpr;
           ctx.scale(dpr, dpr);
           ctx.lineCap='round';
           ctx.lineWidth="5";
           ctx.beginPath();
           ctx.arc(400/this.data.rate/2,400/this.data.rate/2,400/this.data.rate/2-2*lineWidth,0,2*Math.PI,false);
           ctx.strokeStyle ="#000000";
           ctx.stroke();
           
        })
  },


  drawact:function(){
    var that = this;
    var timer = setInterval(function(){
      var angle = 1.5 + 2*(that.data.time*60*1000 - that.data.mtime) / (that.data.time*60*1000)
      var currenTime = that.data.mtime-100
      that.setData({
        mtime:currenTime
      })
      if(angle<3.5){
        if (currenTime%1000 == 0){
          var time1 = currenTime/1000; //将当前毫秒数比1000得到整的秒数s
          var time2 = parseInt(time1/60); //整秒数除以60得到分钟
          var time3 = (time1-time2*60)>=10 ? (time1-time2*60):'0'+(time1-time2*60); //当前秒数减去当前分钟秒数乘60 得到不足一分钟的秒数
          var time2 = time2>=10 ? time2:'0'+time2;
          that.setData({
             timestr:time2+':'+time3
          })
        }

        var lineWidth = 6/that.data.rate;
        const query = wx.createSelectorQuery()
        query.select('#clock-active')
            .fields({ node:true, size: true})
            .exec(res => {
               const canvas = res[0].node;
               const ctx = canvas.getContext('2d');
               const dpr = wx.getSystemInfoSync().pixelRatio;
               canvas.width = res[0].width * dpr;
               canvas.height = res[0].height * dpr;
               ctx.scale(dpr, dpr);
               ctx.lineCap='round';
               ctx.lineWidth="5";
               ctx.beginPath();
               ctx.arc(400/that.data.rate/2,400/that.data.rate/2,400/that.data.rate/2-2*lineWidth,1.5*Math.PI,angle*Math.PI,false);
               ctx.strokeStyle ="#FFFFFF";
               ctx.stroke();
            })
      } else {

        var logs = wx.getStorageSync('logs') || [];

        logs.unshift({
          data:formatTime(new Date),
          cate:that.data.cateactive,
          time:that.data.time
        })
        wx.setStorageSync('logs', logs)
        wx.vibrateLong();
        wx.vibrateLong();
        wx.vibrateLong();
        that.setData({
          timestr:'00:00',
          backshow:true,
          pauseshow:false,
          continueshow:false,
        })
          clearInterval(timer)
      }
     

    },100)
    that.setData({
      timer:timer
    })
   
  },
  pause:function(){
    clearInterval(this.data.timer);
    this.setData({
     pauseshow:false,
     continueshow:true,
     backshow:false,
    })
   
  },
  continue:function(){
    this.drawact();
    this.setData({
      pauseshow:true,
      continueshow:false,
      backshow:false,
    })
  },
  giveup:function(){
     this.setData({
      showclock:false,
    })
  },
  back:function(){
    clearInterval(this.data.timer);
    this.setData({
      showclock:false,
    })
  }
  


})
