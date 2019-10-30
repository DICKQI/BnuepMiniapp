import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtMessage} from 'taro-ui'
import {ClButton, ClInput, ClFlex} from 'mp-colorui'
import {hostname} from "../../config/proxy";

export default class createTeam extends Taro.Component {

  config = {
    navigationBarTitleText: '创建队伍'
  };

  constructor() {
    super(...arguments);
    this.state = {
      cid: this.$router.params.cid,
      works_name: '',
      team_name: '',
      guide_teacher: ''
    }
  }

  setWorkName(e) {
    this.setState({
      works_name: e
    })
  }

  setTeamName(e) {
    this.setState({
      team_name: e
    })
  }

  setGuideTeacher(e) {
    this.setState({
      guide_teacher: e
    })
  }

  createTeam() {
    Taro.request({
      url: hostname + 'contest/createteam/' + this.state.cid + '/',
      method: 'POST',
      data: {
        works_name: this.state.works_name,
        team_name: this.state.team_name,
        guide_teacher: this.state.guide_teacher
      },
      header: {
        'Cookie': Taro.getStorageSync('cookies'),
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '创建成功',
          'type': 'success'
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        }, 1000)
      } else {
        Taro.atMessage({
          'message': res.data.errMsg,
          'type': 'error'
        })
      }
    })
  }

  render() {
    return (
      <View>
        <AtMessage/>
        <View style='margin-top: 8vh;'>
          <ClInput title='作品名' name='work_name' type='text' onChange={this.setWorkName.bind(this)}
                   value={this.state.works_name} placeholder='请输入作品名' titleWidth='150px'/>
          <ClInput title='团队名' name='team_name' type='text' onChange={this.setTeamName.bind(this)}
                   value={this.state.team_name} placeholder='请输入团队名' titleWidth='150px'/>
          <ClInput title='指导老师' name='guide_teacher' type='text' onChange={this.setGuideTeacher.bind(this)}
                   value={this.state.guide_teacher} placeholder='请输入指导老师姓名' titleWidth='200px'/>
          <View style='margin-top: 2vh;'>
            <ClFlex justify={"center"} align={"center"}>
              <ClButton long shape={"radius"} formType={"submit"} onClick={this.createTeam.bind(this)}>创建</ClButton>
            </ClFlex>
          </View>
        </View>
      </View>
    );
  }

}
