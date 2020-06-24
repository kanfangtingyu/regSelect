<template>
  <div class="dashboard-editor-container">
    <el-steps :active="active">
      <el-step title="Select Method" />
      <el-step title="Select Fields" />
      <el-step title="Vlidate" />
      <el-step title="Save" />
      <el-step title="" />
    </el-steps>
    <el-button-group style="margin:10px 0;">
      <el-button type="primary" icon="el-icon-arrow-left" :disabled="active==1" @click="last_step">last step</el-button>
      <el-button type="primary" :disabled="active==5" @click="next_step">next step<i class="el-icon-arrow-right el-icon--right" /></el-button>
    </el-button-group>
    <div v-if="active==1">
      <el-radio v-model="radio" label="1">regular expression</el-radio>
      <el-radio v-model="radio" label="2">delimiters</el-radio>
    </div>
    <div v-if="active==2">
      <el-popover
        v-model="visible"
        placement="bottom"
        width="300"
        @show="showSelect"
      >
        <el-form ref="form" :model="selectform" label-width="90px">
          <el-button style="margin-left:200px;margin-bottom:10px" type="primary" @click="submitTxt">OK</el-button>
          <el-form-item label="Field Name">
            <el-input v-model="selectform.selectname" @keyup.enter.native="submitTxt" />
          </el-form-item>
          <el-form-item label="Value">
            {{ selectform.selectTxtValue }}
          </el-form-item>
        </el-form>
        <el-input id="selectInput" slot="reference" v-model="rawdata[1]._event.raw" :readonly="true" placeholder="请输入内容" />
      </el-popover>
      <div v-if="tablevisible">
        <fixed-thead :rawdata.sync="rawdata" />
      </div>
    </div>
    <div v-if="active==3">
      <el-input v-model="returnReg" :readonly="true" />
    </div>
    <div v-if="active==4">
      <el-radio v-model="radio" label="1">备选项4</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio>
    </div>
    <div v-if="active==5">
      <el-radio v-model="radio" label="1">备选项5</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio>
    </div>
  </div>
</template>

<script>
import FixedThead from '../../components/FixedThead'
export default {
  name: 'DashboardAdmin',
  components: { FixedThead },
  data() {
    return {
      active: 2,
      radio: '1',
      visible: false,
      visible2: false,
      tablevisible: false,
      // 返回的reg表达式
      returnReg: '',
      // 传到后台的数据
      rawdata: {
        '1': {
          _event: { raw: '15.151.182.2 - - [15/May/2005:04:05:34 -0700] \"POST /rs-soap/services/RSPortal HTTP/1.0\" 200 384 \"-\" \"Axis/1.1\"' }
        }
      },
      // 选中的value值
      selectform: {
        selectname: '',
        selectTxtValue: ''
      }
    }
  },
  methods: {
    last_step() {
      this.active--
    },
    next_step() {
      if (this.active === 2) {
        this.axios.post('http://10.124.207.246:5000/regex/api/v1.0/extraction', this.rawdata)
          .then(res => {
            this.returnReg = res.data
          })
          .catch(err => {
            console.log(err)
          })
        // fetchList().then(res => {
        //   console.log(res)
        // })
      }
      this.active++
    },
    submitTxt() {
      this.tablevisible = true
      this.visible = false
      if (this.selectform.selectname && this.selectform.selectname.length > 0) {
        this.$set(this.rawdata[1], this.selectform.selectname, this.selectform.selectTxtValue)
      } else {
        alert('Please enter your name')
      }
      this.selectform.selectname = ''
    },
    // step2弹框
    showSelect() {
      const a = document.getElementById('selectInput')
      if (a.selectionStart === a.selectionEnd) {
        alert('Please select the field')
        this.visible = false
      }
      this.selectform.selectTxtValue = a.value.substring(a.selectionStart, a.selectionEnd)
    }
  }
}
</script>

<style lang="scss">
#selectInput{
  letter-spacing: 1px;
}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
