import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtInput, AtButton, AtMessage} from 'taro-ui'
import {ClButton, ClInput} from 'mp-colorui'
import {hostname} from "../../config/proxy";

export default class createTeam extends Taro.Component {

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
        'Cookie': Taro.getStorageSync('cookies')[0],
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '创建成功',
          'type': 'success'
        }).then(
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        )
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
                   value={this.state.works_name} placeholder='请输入作品名'/>
          <ClInput title='团队名' name='team_name' type='text' onChange={this.setTeamName.bind(this)}
                   value={this.state.team_name} placeholder='请输入团队名'/>
          <ClInput title='指导老师' name='guide_teacher' type='text' onChange={this.setGuideTeacher.bind(this)}
                   value={this.state.guide_teacher} placeholder='请输入指导老师姓名'/>
          <View style='margin-top: 2vh;'>
            <ClButton long shape={"radius"} formType={"submit"} onClick={this.createTeam.bind(this)}>创建</ClButton>
          </View>
        </View>
      </View>
    );
  }

}
