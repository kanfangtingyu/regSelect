<template>
  <div class="app-container">
    <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column v-for="eachData in tableHeader" :key="eachData" :label="eachData">
        <template slot="header">
          {{ eachData }}
          <i v-if="eachData!=='raw'" class="el-icon-delete" @click="deleteOption(eachData)" />
        </template>
        <template slot-scope="scope">
          {{ scope.row[eachData] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  props: {
    rawdata: {
      type: Object,
      default: function() { return [] }
    }
  },
  data() {
    return {
      search: '',
      tableData: [],
      tableHeader: [],
      key: 1 // table key,
    }
  },
  watch: {
    rawdata: {
      handler() {
        this.tableData = []
        this.tableHeader = []
        const cacheObj = {}
        for (var a in this.rawdata[1]) {
          if (a === '_event') {
            cacheObj.raw = this.rawdata[1][a].raw
            this.tableHeader.push('raw')
          } else {
            cacheObj[a] = this.rawdata[1][a]
            this.tableHeader.push(a)
          }
        }
        this.tableData.push(cacheObj)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    deleteOption(eachData) {
      delete this.tableData[0][eachData]
      this.delItem(eachData, this.tableHeader)
      delete this.rawdata[1][eachData]
      this.$emit('rawdata', this.rawdata)
    },
    // 删除数组中特定项的方法
    delItem(item, list) {
      // 表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
      list.splice(list.indexOf(item), 1)
    }
  }
}
</script>

