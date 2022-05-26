<template>
  <div>
    <div id="Graph"></div>
  </div>
</template>
<script>
const vis = require("vis-network/dist/vis-network.min.js");
require("vis-network/dist/dist/vis-network.min.css");
export default {
  name: "NetworkGraph",
  props: {
    nodes: Array,
    edges: Array,
  },
  methods: {
    init() {
      var data = {
        nodes: new vis.DataSet(this.nodes),
        edges: new vis.DataSet(this.edges),
      };
      console.log(this.edges);
      console.log(this.nodes);
      const network = new vis.Network(
        document.getElementById("Graph"),
        data,
        {}
      );
      var options = {
        autoResize: true,
        height: "80%",
        width: "80%",
        locale: "en",
        clickToUse: false,
      };
      network.setOptions(options);
      //考虑到网络拓扑不会频繁变动，这里直接用新建，比较简单
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
#Graph {
  width: 440px;
  height: 560px;
  border: 2px rgb(57, 57, 58) outset;
  left: 30px;
  top: 108px;
  position: absolute;
  background-color: rgb(255 255 224); /* rgb(160, 168, 148); */
}
.vis-network {
  position: absolute;
  top: 10%;
  left: 10%;
}
</style>
