<template>
  <div class="dashboard-editor-container">
    <el-steps :active="active">
      <el-step title="Enter Data" />
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
      <p>Please enter the data you want to parse</p>
      <codemirror ref="returnReg" v-model="inputlog" :options="cmOptions1" />
    </div>
    <div v-if="active==2">
      <p>Please choose the feild and add name</p>
      <el-popover
        v-model="visible"
        placement="bottom"
        width="500"
        @show="showSelect"
      >
        <el-form ref="form" :model="selectform" label-width="90px">
          <el-button style="margin-left:400px;margin-bottom:10px" type="primary" @click="submitTxt">OK</el-button>
          <el-form-item label="Field Name">
            <el-input v-model="selectform.selectname" @keyup.enter.native.stop="submitTxt" />
          </el-form-item>
          <el-form-item label="Value">
            {{ selectform.selectTxtValue }}
          </el-form-item>
        </el-form>
        <codemirror id="selectInput" ref="selectInput" slot="reference" v-model="rawdata[1]._event.raw" :options="cmOptions" type="textarea" :readonly="true" />
        <!-- <el-input id="selectInput" slot="reference" v-model="rawdata[1]._event.raw" type="textarea" :rows="3" :readonly="true" placeholder="请输入内容" /> -->
      </el-popover>
      <div v-if="tablevisible">
        <fixed-thead :rawdata.sync="rawdata" />
      </div>
    </div>
    <div v-if="active==3">
      <codemirror ref="returnReg" v-model="returnReg" :options="cmOptions" />
      <!-- <el-input v-model="returnReg" :readonly="true" /> -->
    </div>
    <div v-if="active==4">
      <p>to be continue</p>
    </div>
    <div v-if="active==5">
      <p>to be continue</p>
    </div>
  </div>
</template>

<script>
import FixedThead from '../../components/FixedThead'
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/python/python.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/go/go'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/http/http'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/http/http'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/xml/xml'
require('codemirror/theme/3024-day.css')

export default {
  name: 'DashboardAdmin',
  components: {
    FixedThead,
    codemirror
  },
  data() {
    return {
      active: 1,
      radio: '1',
      visible: false,
      visible2: false,
      tablevisible: false,
      // 输入的日志data
      inputlog: '15.151.182.2 - - [15/May/2005:04:05:34 -0700] \"POST /rs-soap/services/RSPortal HTTP/1.0\" 200 384 \"-\" \"Axis/1.1\"',
      // 返回的reg表达式
      returnReg: '',
      // 传到后台的数据
      rawdata: {
        '1': {
          _event: { raw: '' }
        }
      },
      // 选中的value值
      selectform: {
        selectname: '',
        selectTxtValue: ''
      },
      // reg富文本配置
      cmOptions1: {
        tabSize: 4,
        mode: 'javascript',
        theme: 'ambiance-mobile',
        lineNumbers: false,
        line: true
        // readOnly: true
        // more CodeMirror options...
      },
      cmOptions: {
        tabSize: 4,
        mode: 'javascript',
        theme: '3024-day',
        lineNumbers: false,
        line: true
        // readOnly: true
        // more CodeMirror options...
      }
    }
  },
  methods: {
    last_step() {
      this.active--
    },
    next_step() {
      if (this.active === 1) {
        this.rawdata[1]._event.raw = this.inputlog
      }
      if (this.active === 2) {
        this.axios.post('http://10.124.207.246:5000/regex/api/v1.0/extraction', this.rawdata)
          .then(res => {
            if (res.data.length > 0) {
              this.returnReg = res.data
            } else {
              this.returnReg = 'You have choose no data or the data can not be parsed'
            }
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
    showSelect(value) {
      const a = this.$refs.selectInput.codemirror.getSelection()
      if (a && a.length > 0) {
        this.selectform.selectTxtValue = a
      } else {
        this.visible = false
        alert('Please select the field')
      }
    }
  }
}
</script>

<style lang="scss">
.CodeMirror {
  font-size : 15px;
  letter-spacing: 2px;
}
#selectInput {
  .CodeMirror {
    border: 1px solid #eee;
    height: auto;
  }

  .CodeMirror-scroll {
      height: auto;
      overflow-y: hidden;
      overflow-x: auto;
  }
}
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
