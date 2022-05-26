<template>
  <p id="Top">DNN Inference Acceleration</p>
  <el-aside>
    <div class="left">Options</div>
	<!-- <div id="app">
	    <vue-simple-spinner></vue-simple-spinner>
	  </div> -->
    <div class="select">
      <p style="margin-left: 10px">Dataset</p>
      <el-select
        v-model="select_dataset"
        @change="test1"
        placeholder="Select"
        style="width: 200px"
      >
        <el-option
          v-for="item in dataset"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <p style="margin-left: 10px">Model</p>
      <el-select v-model="select_dnn" placeholder="Select" style="width: 200px">
        <el-option
          v-for="item in model"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <p style="margin-left: 10px">Inference mode</p>
      <el-select v-model="select_mode" placeholder="Select" style="width: 200px">
        <el-option
          v-for="item in inference"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <p style="margin-left: 10px">Number of test tasks</p>
      <el-select v-model="select_num" placeholder="Select" style="width: 200px">
        <el-option
          v-for="item in tasks"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div id="options_select">
      <el-button class="button" type="primary" v-on:click="Confirm()"
        >Confirm</el-button
      >
    </div>
  </el-aside>
  <el-main>
    <div class="show">
      <NetworkGraph :edges="edges" :nodes="nodes" />
      <!-- <img alt="Vue logo" src="../assets/DNN.png"> -->
    </div>
    <!-- dataset intro -->
    <div class="data_intro" v-if="select_dataset == 'CIFAR10'">
      {{ intro1 }}
      <!-- CIFAR10: 
		 该数据集包含了飞机、汽车、鸟等10个类别物体的32×32大小的彩色图片，每个类别有6000张图;
		 类别——airplane，automobile，bird，cat，deer，dog，frog，horse，ship，truck. -->
    </div>
    <div class="data_intro" v-if="select_dataset == 'IMAGENET'">
      {{ intro2 }}
      <!-- 	ImageNet: 一个计算机视觉数据集，包合 14,197,122张图片和21,841个Synset索引；
		数据集中的图片涵盖了大部分生活中会看到的图片类别。 -->
    </div>
    <div class="data_intro" v-if="select_dataset == 'AGNEWS'">
      {{ intro3 }}
      <!-- AGNEWS: AGNews数据集是从2000多个新闻源收集的新闻文章的集合。
		该数据集包括120,000个训练样本和7,600个测试样本。每个样本都是带有四类标签的短文本。 -->
    </div>
    <!-- model show -->
    <div class="control_img">
      <img src="../assets/VGG.png" v-if="select_dnn == 'VGG-16'" />
      <img
        src="../assets/SqueezeNet.png"
        v-if="select_dnn == 'SqueezeNet-v1.0'"
      />
      <img src="../assets/logo2.jpg" v-if="select_dnn == 'ResNet-34'" />
      <img
        src="../assets/logo2.jpg"
        v-if="select_dnn == 'Inception-v3'"
      />
      <img src="../assets/logo2.jpg" v-if="select_dnn == 'CharCNN'" />
    </div>

    <div class="table-loc">
      <el-table
        :data="listTable"
        stripe
        style="width: 85%"
        :header-cell-style="{
          'text-align': 'center',
          background: '#4B4B4B',
          color: '#F5F6FA',
        }"
        :cell-style="{
          'text-align': 'center',
          background: '#666E92',
          color: '#F5F6FA',
        }"
      >
        <el-table-column prop="time" label="Datetime" width="140">
        </el-table-column>
        <el-table-column prop="mode" label="Mode" width="140">
        </el-table-column>
        <el-table-column prop="dnn" label="DNN" width="140"> </el-table-column>
        <el-table-column prop="dataset" label="Dataset" width="150">
        </el-table-column>
        <el-table-column prop="num_images" label="Number of tasks" width="100">
        </el-table-column>
        <el-table-column
          prop="avg_latency"
          label="Average latency(ms)"
          width="138"
        >
        </el-table-column>
        <el-table-column prop="accuracy" label="Accuracy(%)" width="110">
        </el-table-column>
        <el-table-column prop="avg_latency" label="Avg_latency" width="180">
        </el-table-column>
      </el-table>
    </div>

    <div class="chart1">
      <!-- <div id="myChart" style="width: 600px;height:400px;"></div> -->
      <div id="myChart1" :style="{ width: '400px', height: '400px' }"></div>
    </div>
    <div class="chart2">
      <!-- <div id="myChart" style="width: 600px;height:400px;"></div> -->
      <div id="myChart2" :style="{ width: '400px', height: '400px' }"></div>
    </div>
    <div class="chart3">
      <!-- <div id="myChart" style="width: 600px;height:400px;"></div> -->
      <div id="myChart3" :style="{ width: '575px', height: '240px' }"></div>
    </div>

    <div class="Pie1">
      <div id="Pie1" style="width: 370px; height: 260px"></div>
    </div>
    <div class="Pie2">
      <div id="Pie2" style="width: 370px; height: 260px"></div>
    </div>
    <div class="Pie3">
      <div id="Pie3" style="width: 370px; height: 260px"></div>
    </div>
  </el-main>

  <div class="clientInfo">
    <div class="content">
      <div id="results">Results</div>
      <!-- <div id="speedup">{{ "Speedup " }}</div> -->
      <!-- <div id="accuracy">{{ "Accuracy (%)" }}</div> -->
	  <div id="speedup">{{ "Latency: " + this.avg_latency + " ms" }}</div>
	  <div id="accuracy">{{ "Accuracy: " + this.accuracy + "%" }}</div>
      <div id="exit_point">{{ "Exit point--Exit rate " }}</div>
      
      <!-- <div id="accuracy">{{ "Accuracy: " + acc + "%" }}</div> -->
      <div id="exit_point">{{ "Exit point--Exit rate: " }}</div>
      <div class="text-wrapper">
        {{
			" Respberry Pi 3B +:\n"+
          +this.d_exit[0]*100 + "% at device\n " +(1-this.d_exit[0])*100+"% at edge\n\n "+
          "Respberry Pi 4B:\n"+
		  parseFloat(this.d_exit[1]*100).toFixed(1) +"% at device\n " 
		  +parseFloat((1-this.d_exit[1])*100).toFixed(1) +"% at edge\n\n "+
		  "Jetson Nano:\n"+
		  parseFloat(this.d_exit[2]*100).toFixed(1) +"% at device\n " 
		  +parseFloat((1-this.d_exit[2])*100).toFixed(1) +"% at edge\n "
          
        }}
      </div>
	  
    </div>
  </div>
</template>



<script>
import NetworkGraph from "../components/NetworkGraph.vue";
import { ref } from "vue";
import XLSX from "xlsx";
import * as echarts from "echarts";
import axios from "axios";
// import qs from "qs";
import Spinner from 'vue-simple-spinner'
import Vue from 'vue'
axios.defaults.baseURL = "/api";


export default {
  name: "app",
  components: {
    NetworkGraph,
  },
  data() {
    return {
      nowDate: "2022",
      confirm: 2,
      listTable: [
        // {
        //   mode: "Edge-Only",
        //   dnn: "VGG-16",
        //   dataset: "CIFAR10",
        //   num_images: 1000,
        //   avg_latency: 30,
        //   accuracy: 90,
        //   time: " ",
        // },
      ],
      intro1:
        " CIFAR10: 该数据集包含了飞机、汽车、鸟等10个类别物体的32×32大小的彩色图片，每个类别有6000张图;\n 类别——airplane，automobile，bird，cat，deer，dog，frog，horse，ship，truck.",
      intro2:
        " ImageNet: 一个计算机视觉数据集，包合 14,197,122张图片和21,841个Synset索引;\n 数据集中的图片涵盖了大部分生活中会看到的图片类别。",
      intro3:
        " AGNEWS: AGNews数据集是从2000多个新闻源收集的新闻文章的集合。\n 该数据集包括120,000个训练样本和7,600个测试样本。每个样本都是带有四类标签的短文本。",

      nodes: [
        { id: "node1", label: "Node 1" },
        { id: "node2", label: "Node 2" },
        { id: "node3", label: "Node 3" },
        { id: "node4", label: "Node 4" },
      ],
      edges: [
        { from: "node2", to: "node1" },
        { from: "node1", to: "node3" },
        { from: "node1", to: "node4" },
      ],
      dataset: [
        {
          value: "CIFAR10",
          label: "CIFAR10",
        },
        {
          value: "IMAGENET",
          label: "ImageNet",
        },
        {
          value: "AGNEWS",
          label: "AGNEWS",
        },
      ],
      model: [
        {
          value: "Select dataset please",
          label: "Select dataset please",
        },
      ],
      model_1: [
        {
          value: "VGG-16",
          label: "Multi-exit VGG-16",
        },
        {
          value: "SqueezeNet-v1.0",
          label: "Multi-exit SqueezeNet-v1.0",
        },
      ],
      model_2: [
        {
          value: "ResNet-34",
          label: "Multi-exit ResNet-34",
        },
        {
          value: "Inception-v3",
          label: "Multi-exit Inception-v3",
        },
      ],
      model_3: [
        {
          value: "CharCNN",
          label: "Multi-exit CharCNN",
        },
      ],
      inference: [
        {
          value: "Device-Only",
          label: "Device-only",
        },
        {
          value: "Edge-Only",
          label: "Edge-only",
        },
        {
          value: "Synergy",
          label: "End-edge synergy",
        },
        {
          value: "Online-Test",
          label: "Online-Test",
        },
      ],
      tasks: [
        {
          value: "100",
          label: "100",
        },
        {
          value: "500",
          label: "500",
        },
        {
          value: "1000",
          label: "1000",
        },
        {
          value: "5000",
          label: "5000",
        },
        {
          value: "10000",
          label: "10000",
        },
      ],
      select_dataset: ref("CIFFAR10"),//IMAGENET
      select_dnn: ref("SqueezeNet-v1.0"),//ResNet-34
      select_mode: ref("Synergy"),
      select_num: ref("1000"),

		chartData:'',
		avg_latency:'',
		accuracy:'',
		d_exit:[],
		mode_latency:[],
		modeList:["Edge-Only","Device-Only","Synergy"],
      speedup: 6.3,
      // type: "Raspberry",
      acc: "xx",
      exit_point1: "exit-1",
      rate1: "50%\n",
      exit_point2: "exit-2",
      rate2: "xx%\n",
      exit_point3: "exit-x",
      rate3: "xx%\n",
    };
  },
  mounted() {
    // this.readWorkbookFromRemoteFile("/result/result_info.xlsx");
    
    // this.Confirm();

    // this.drawLine1();
    // this.drawLine2();
    // this.getPie1();
    // this.getPie2();
    // this.getPie3();
    // this.drawLine3();
  },
  methods: {
    test1() {
      if (this.select_dataset == "CIFAR10") {
        this.model = this.model_1;
      } else if (this.select_dataset == "IMAGENET") {
        this.model = this.model_2;
      } else this.model = this.model_3;

      // this.$forceUpdate();
    },
    test() {
      console.log("test");
      console.log(this.nodes);
      console.log(this.edges);
    },
    Confirm() {
      // if (this.confirm == 0) return false;
      console.log(
        "select:",
        this.select_dataset,
        this.select_dnn,
        this.select_mode,
        this.select_num
      );
		  
      let formData = new FormData();
      	 
      //下面是表单绑定的data 数据
      formData.append("data_opt", this.select_dataset);
      formData.append("dnn_opt", this.select_dnn);
      formData.append("mode_opt", this.select_mode);
      formData.append("num_images", this.select_num);
	  // this.avg_latency=0;
	  axios.post("http://223.3.68.61:5050/mednn/result",formData).then(res => {
	      console.log("数据：", res);
		  this.chartData = res.data;
		  this.avg_latency=this.chartData["avg_latency"];
		  this.accuracy=this.chartData["accuracy"];
		  this.d_exit=this.chartData["d_exit"];
		  console.log("this.d_exit: ", this.d_exit);
	  }).catch(err => {
	      console.log(err);
	  });
	  
	  for(let i=0;i<3;i++)
	  {
		  let modeList=["Edge-Only","Device-Only","Synergy"];
		  let formData = new FormData();
		  formData.append("data_opt", this.select_dataset);
		  formData.append("dnn_opt", this.select_dnn);
		  formData.append("mode_opt", this.modeList[i]);
		  formData.append("num_images", this.select_num);
		  axios.post("http://223.3.68.61:5050/mednn/result",formData).then(res => {
		      console.log("mode--latency", this.modeList[i],res.data["avg_latency"]);
		  		  this.chartData = res.data;
		  		  this.mode_latency[i]=this.chartData["avg_latency"];
		  		  
		  }).catch(err => {
		      console.log(err);
		  });
	  }
	  
	  setTimeout(() =>{
	      console.log('ok');
		  this.formatTableDate();
		  if(this.select_mode=="Device-Only")
		  {
			  this.d_exit=[1,1,1];
		  }
		  if(this.select_mode=="Edge-Only"||this.select_mode=="Online-Test")
		  {
				this.d_exit=[0,0,0];
		  }
		  
		  this.drawLine1();
		  this.drawLine2();
		  this.getPie1();
		  this.getPie2();
		  this.getPie3();
		  this.drawLine3();
	  },400);
	  
    },
	
	currentTime() {
      setInterval(this.formatTableDate);
    },
    formatTableDate() {
      // if (this.confirm == 0) return false;
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let week = date.getDay(); // 星期
      let weekArr = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.nowDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      // if (this.confirm == 2) {
      //   this.listTable[0].time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      //   this.confirm = 0;
      //   return false;
      // }

      // this.confirm = 0;

      let rowTable = {
        mode: this.select_mode,
        dnn: this.select_dnn,
        dataset: this.select_dataset,
        num_images: this.select_num,
        avg_latency: this.avg_latency,
        accuracy: this.accuracy,
        time: this.nowDate,
      };
      //这里的rowTable的属性名注意要与上面表格的prop一致
      //sheetArray的属性名与上传的表格的列名一致
      // rowTable.name = sheetArray[item].mode;
      // rowTable.age = sheetArray[item].dnn;
      // rowTable.city = sheetArray[item].dataset;
      // rowTable.sno = sheetArray[item].num_images;
	  if(this.listTable!== null && this.listTable.length>=6)
	  {
		  this.listTable.splice(0,3);
	  }
		
      this.listTable.push(rowTable);
    },

    drawLine1() {
      // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
      let myChart = echarts.init(document.getElementById("myChart1"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "DNN推理延迟",
          x: "center",
          textStyle: {
            //标题内容的样式
            color: "#fff",
            //   fontStyle: 'normal',
            //   fontWeight: 100,
            //   fontSize: 16 //主题文字字体大小，默认为18px
          },
        },

        // legend: {
        //           data: ["latency"]
        //         },
        tooltip: {},
        xAxis: {
          data: [
            "Raspberry_ Pi 3B+",
            "Raspberry_ Pi 4B",
            "NVIDIA_ Jetson Nano",
          ],

          axisLabel: {
            interval: 0,
            lineHeight: 18,
            formatter: function (value) {
              return value.split("_").join("\n");
            },
          },
        },
        yAxis: {
          name: "          Average latency(ms)",
          color: "#fff", // 标题颜色
          rotate: -90,
        },
        series: [
          {
            name: "Average latency(ms)",
            type: "bar",
            barWidth: 30,
            barGap: "70%" /*多个并排柱子设置柱子之间的间距*/,
            barCategoryGap: "50%" /*多个并排柱子设置柱子之间的间距*/,

            data: [this.avg_latency,this.avg_latency, this.avg_latency],
            itemStyle: {
              normal: {
                barBorderRadius: false,
                //color: '#1E9FFF',
              },
            },
          },
        ],
      });
      
    },

    drawLine2() {
      // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
      let myChart = echarts.init(document.getElementById("myChart2"));
      // 绘制图表
      var option = {
		title: {
		  text: "Exit Tasks at Device & Edge",
		  x: "center",
		  textStyle: {
		    //标题内容的样式
		    color: "#fff",
		    //   fontStyle: 'normal',
		    //   fontWeight: 100,
		    //   fontSize: 16 //主题文字字体大小，默认为18px
		  },
		},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
			top: 25,
			data: ["Exit at the edge", "Exit at the device"],
			textStyle: {color: "#F5F5F5",},
			
        },
        xAxis: {
          data: [
            "Raspberry_ Pi 3B+",
            "Raspberry_ Pi 4B",
            "NVIDIA_ Jetson Nano",
          ],
		  axisLabel: {
		    interval: 0,
		    lineHeight: 18,
		    formatter: function (value) {
		      return value.split("_").join("\n");
		    },
		  },
        },
        yAxis: {},
        series: [
          {
            name: "Exit at the edge",
            type: "bar",
            stack: "vistors",
            barWidth: 30,
            data: [this.select_num*(1-this.d_exit[0]),this.select_num*(1-this.d_exit[1]),this.select_num*(1-this.d_exit[2])],
            color: "#7fecad",
          },
          {
            name: "Exit at the device",
            type: "bar",
            stack: "vistors",
            barWidth: 30,
            data: [this.select_num*this.d_exit[0],this.select_num*this.d_exit[1],this.select_num*this.d_exit[2]],
            color: "#4cabce",
          },
        ],
      };
      myChart.setOption(option);
     
    },

    drawLine3() {
      //================== latency=========================
      let myChartCurve = echarts.init(document.getElementById("myChart3"));
      myChartCurve.setOption({
        title: {
          text: "Speedup",
          x: "center",
          textStyle: {
            //标题内容的样式
            color: "#fff",
            //   fontStyle: 'normal',
            //   fontWeight: 100,
            //   fontSize: 16 //主题文字字体大小，默认为18px
          },
        },

        color: ["#fcc550", "#4fd7fd"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          top: 25,
          data: ["Raspberry Pi 3B+", "NVIDIA Jetson Nano"], //,'Raspberry Pi 4B'
          textStyle: {
            fontSize: "12",
            color: "#fff",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Edge-Only", "Device-Only", "Synergy"],
          axisLabel: {
            textStyle: {
              fontSize: "12",
              color: "#fff",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "Average latency(ms)",
          axisLabel: {
            textStyle: {
              fontSize: "12",
              color: "#fff",
            },
          },
        },
        series: [
          {
            name: "Raspberry Pi 3B+",
            smooth: true,
            data: [this.mode_latency[0],this.mode_latency[1], this.mode_latency[2]],
            type: "line",
            areaStyle: {},
          },
          // {
          //   name:'Raspberry Pi 4B',
          //   smooth:true,
          //   data: [40, 47, 32],
          //   type: 'line',
          //   areaStyle: {}
          // },
          {
            name: "NVIDIA Jetson Nano",
            smooth: true,
            data: [this.mode_latency[0],this.mode_latency[1], this.mode_latency[2]],
            type: "line",
            areaStyle: {},
          },
        ],
      });
    },

    getPie1() {
      // 绘制图表
      var myChart = echarts.init(document.getElementById("Pie1"));
      // 指定图表的配置项和数据
      var option = {
        //标题
        title: {
          text: "Raspberry Pi 3B+",
          x: "center", //标题位置
          textStyle: {
            //标题内容的样式
            color: "#fff",
            //   fontStyle: 'normal',
            //   fontWeight: 100,
            //   fontSize: 16 //主题文字字体大小，默认为18px
          },
        },
        // stillShowZeroSum: true,
        //鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)",
        },
        //图例
        legend: {
          //图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 2, //控制图例出现的距离  默认左上角
          left: "center", //控制图例的位置
          // itemWidth: 16,//图例颜色块的宽度和高度
          // itemHeight: 12,
          textStyle: {
            //图例中文字的样式
            color: "#fff",
            fontSize: 16,
          },
          data: ["on device", "on edge"], //, 'transmission'
        },
        //饼图中各模块的颜色
        color: ["#32dadd", "#5ab1ef"], //'#b6a2de',
        // 饼图数据
        series: {
          // name: 'bug分布',
          type: "pie", //echarts图的类型   pie代表饼图
          radius: "64%", //饼图中饼状部分的大小所占整个父元素的百分比
          center: ["50%", "50%"], //整个饼图在整个父元素中的位置
          // data:''               //饼图数据
          data: [
            //每个模块的名字和值
            { name: "on device", value: this.select_num*this.d_exit[0] },
            { name: "on edge", value: this.select_num*(1-this.d_exit[0]) },
            // { name: '已完成', value: 50 }
          ],
          itemStyle: {
            normal: {
              label: {
                show: true, //饼图上是否出现标注文字 标注各模块代表什么  默认是true
                textStyle: {
                  //标题内容的样式
                  color: "#fffbf0",
                  fontStyle: "normal",
                },

                // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
              },
              labelLine: {
                show: true, //官网demo里外部标注上的小细线的显示隐藏    默认显示
              },
            },
          },
        },
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    getPie2() {
      // 绘制图表
      var myChart = echarts.init(document.getElementById("Pie2"));
      // 指定图表的配置项和数据
      var option = {
        //标题
        title: {
          text: "Raspberry Pi 4B",
          x: "center", //标题位置
          textStyle: {
            //标题内容的样式
            color: "#f0fcff",
          },
        },
        // stillShowZeroSum: true,
        //鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)",
        },
        //图例
        legend: {
          //图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 2, //控制图例出现的距离  默认左上角
          left: "center", //控制图例的位置
          // itemWidth: 16,//图例颜色块的宽度和高度
          // itemHeight: 12,
          textStyle: {
            //图例中文字的样式
            color: "#fff",
            fontSize: 16,
          },
          data: ["on device", "on edge"], //, 'transmission'
        },
        //饼图中各模块的颜色
        color: ["#32dadd", "#5ab1ef"], //'#b6a2de',
        // 饼图数据
        series: {
          // name: 'bug分布',
          type: "pie", //echarts图的类型   pie代表饼图
          radius: "64%", //饼图中饼状部分的大小所占整个父元素的百分比
          center: ["50%", "50%"], //整个饼图在整个父元素中的位置
          // data:''               //饼图数据
          data: [
            //每个模块的名字和值
            { name: "on device", value: this.select_num*this.d_exit[1]  },
            { name: "on edge", value: this.select_num*(1-this.d_exit[1]) },
            // { name: '已完成', value: 50 }
          ],
          itemStyle: {
            normal: {
              label: {
                show: true, //饼图上是否出现标注文字 标注各模块代表什么  默认是true
                textStyle: {
                  //标题内容的样式
                  color: "#fffbf0",
                  fontStyle: "normal",
                },

                // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
              },
              labelLine: {
                show: true, //官网demo里外部标注上的小细线的显示隐藏    默认显示
              },
            },
          },
        },
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    getPie3() {
      // 绘制图表
      var myChart = echarts.init(document.getElementById("Pie3"));
      // 指定图表的配置项和数据
      var option = {
        //标题
        title: {
          text: "NVIDIA Jetson Nano",
          x: "center", //标题位置
          textStyle: {
            //标题内容的样式
            color: "#f0f0f4",
          },
        },
        // stillShowZeroSum: true,
        //鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)",
        },
        //图例
        legend: {
          //图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 2, //控制图例出现的距离  默认左上角
          left: "center", //控制图例的位置
          // itemWidth: 16,//图例颜色块的宽度和高度
          // itemHeight: 12,
          textStyle: {
            //图例中文字的样式
            color: "#fff",
            fontSize: 16,
          },
          data: ["on device", "on edge"], //, 'transmission'
        },
        //饼图中各模块的颜色
        color: ["#cccccc", "#fff143"], //'#b6a2de', #5ab1ef #ffcc33
        // 饼图数据
        series: {
          // name: 'bug分布',
          type: "pie", //echarts图的类型   pie代表饼图
          radius: "64%", //饼图中饼状部分的大小所占整个父元素的百分比
          center: ["50%", "50%"], //整个饼图在整个父元素中的位置
          // data:''               //饼图数据
          data: [
            //每个模块的名字和值
            { name: "on device", value: this.select_num*this.d_exit[2]  },
            { name: "on edge", value: this.select_num*(1-this.d_exit[2]) },
            // { name: '已完成', value: 50 }
          ],
          itemStyle: {
            normal: {
              label: {
                show: true, //饼图上是否出现标注文字 标注各模块代表什么  默认是true
                textStyle: {
                  //标题内容的样式
                  color: "#fffbf0",
                  fontStyle: "normal",
                },
                // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
              },
              labelLine: {
                show: true, //官网demo里外部标注上的小细线的显示隐藏    默认显示
              },
            },
          },
        },
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    readWorkbookFromRemoteFile: function (url) {
      if (this.confirm == 0) return false;
      var xhr = new XMLHttpRequest();
      xhr.open("get", url, true);
      xhr.responseType = "arraybuffer";
      let _this = this;
      xhr.onload = function (e) {
        if (xhr.status === 200) {
          var data = new Uint8Array(xhr.response);
          var workbook = XLSX.read(data, { type: "array" });
          console.log(workbook);
          for (let sheet in workbook.Sheets) {
            //循环读取每个文件
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            //若当前sheet没有数据，则continue
            if (sheetArray.length == 0) {
              continue;
            }
            console.log("读取文件");
            console.log(sheetArray);
            for (let item in sheetArray) {
              let rowTable = {};
              //这里的rowTable的属性名注意要与上面表格的prop一致
              //sheetArray的属性名与上传的表格的列名一致
              rowTable.name = sheetArray[item].mode;
              rowTable.age = sheetArray[item].dnn;
              rowTable.city = sheetArray[item].dataset;
              rowTable.sno = sheetArray[item].num_images;
              this.listTable.push(rowTable);
            }
            console.log(this.listTable);
          }
          var sheetNames = workbook.SheetNames; // 工作表名称集合
          _this.workbook = workbook;
          _this.card = sheetNames;
          _this.cardActive = sheetNames[0];
          _this.getTable(sheetNames[0]);
        }
        e;
      };
      xhr.send();
    },
    async uploadFile(params) {
      if (this.confirm == 0) return false;
      const _file = params.file;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          for (let sheet in workbook.Sheets) {
            //循环读取每个文件
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            //若当前sheet没有数据，则continue
            if (sheetArray.length == 0) {
              continue;
            }
            console.log("读取文件");
            console.log(sheetArray);
            for (let item in sheetArray) {
              let rowTable = {};
              //这里的rowTable的属性名注意要与上面表格的prop一致
              //sheetArray的属性名与上传的表格的列名一致
              rowTable.name = sheetArray[item].mode;
              rowTable.age = sheetArray[item].dnn;
              rowTable.city = sheetArray[item].dataset;
              rowTable.sno = sheetArray[item].num_images;
              this.listTable.push(rowTable);
            }
            console.log(this.listTable);
          }
        } catch (e) {
          this.$message.warning("文件类型不正确！");
        }
      };
      fileReader.readAsBinaryString(_file);
    },
    //上传1个以上文件时弹窗提示错误
    exceed: function () {
      this.$message.error("最多只能上传1个xls文件");
    },
    //删除文件
    remove() {
      this.listTable = [];
    },
  },
};
</script>
<style scoped>
#Top {
  color: azure;
  font-size: 50px;
  margin: 0%;
  background-color: #323232e7;
  position: absolute;
  left: 0%;
  top: 0%;
  width: 100%;
  height: 58px;
}
.el-main {
  height: 800px;
  background-color: #1e1e1e;
  padding: 0%;
  position: absolute;
  top: 58px;
  left: 16%;
  width: 68%;
  height: 100%;
}
.el-aside {
  width: 16%;
  background-color: #252526ee;
  color: azure;
  position: absolute;
  left: 0%;
  height: 100%;
  top: 58px;
}
.el-footer {
  padding: 0%;
}
.left {
  height: 50px;
  margin-top: 20px;
  font-size: 40px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 800px;
  height: 500px;
  margin: 50px;
}
.foot {
  width: 800px;
  margin: 50px;
}
.results {
  margin-left: 40%;
}
#options_select {
  margin-top: 20px;
}
.clientInfo {
  text-align: left;
  color: azure;
  font-size: 20px;
  height: 100%;
  position: absolute;
  top: 58px;
  width: 16%;
  right: 0%;
  background-color: #252526ee;
}
.el-card_header {
  background-color: aqua;
}
#Graph {
  margin-left: 200px;
}
.data_intro {
  position: absolute;
  text-align: left;
  white-space: pre-wrap;
  top: 30px;
  left: 5%;
  right: 5%;
  font-size: 18px;
  color: rgb(255 255 224);
}
#results {
  position: absolute;
  top: 20px;
  left: 20%;
  font-size: 40px;
}
#speedup {
  position: absolute;
  top: 13%;
  left: 16%;
}
/* #clienttype {
  position: absolute;
  top: 15%;
  left: 20%;
} */
#accuracy {
  position: absolute;
  top: 19%;
  text-align: center;
  left: 16%;
}
#exit_point {
  position: absolute;
  top: 25%;
  text-align: center;
  left: 16%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: right; */
  /* color: #2c3e50; */
  margin-top: 200px;
  right: 8px;
}
.control_img {
  position: absolute;
  right: 30px;
  top: 110px;
}
div img {
  width: 470px;
  height: 560px;
}
.content {
  font-size: 20px;
}
.text-wrapper {
  white-space: pre-wrap;
  position: absolute;
  top: 29%;
  text-align: center;
  left: 13%;
  /* right: 11%; */
}
.table-loc {
  position: absolute;
  left: 30px;
  top: 700px;
}
.chart1 {
  position: absolute;
  left: 80px;
  top: 1230px;
}
.chart2 {
  position: absolute;
  left: 80px;
  top: 1610px;
}
.chart3 {
  position: absolute;
  left: 220px;
  top: 2050px;
}
.Pie1 {
  position: absolute;
  right: 56px;
  top: 1200px;
}
.Pie2 {
  position: absolute;
  right: 56px;
  top: 1480px;
}
.Pie3 {
  position: absolute;
  right: 56px;
  top: 1760px;
}
</style>
