import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtInput, AtButton, AtMessage} from 'taro-ui'
import {ClInput, ClButton} from 'mp-colorui'
import {hostname} from "../../config/proxy";

export default class login extends Component {

  config = {
    navigationBarTitleText: '登录'
  };

  constructor() {
    super(...arguments);
    this.state = {
      username: '',
      password: '',
      loading: false
    }
  }

  setUsername(e) {
    this.setState({
      username: e
    })
  };

  setPassword(e) {
    this.setState({
      password: e
    })
  }

  login() {
    Taro.request({
      url: hostname + 'user/',
      method: 'POST',
      data: {
        name: this.state.username,
        password: this.state.password
      },
      header: {
        'Content-Type': 'application/json'
      }
    }).then(res=>{
      if (res.statusCode === 200) {
        // 设置cookies到缓存
        Taro.setStorageSync('cookies', res.cookies);
        Taro.atMessage({
          'message': '欢迎回来',
          'type': 'success'
        });
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
        <View style='display: flex;justify-content: center;align-items: center;flex-direction: column;'>
          <View style='margin-top: 8vh; margin-bottom: 1vh;'>
            <ClInput title='姓名' name='username' type='text' onChange={this.setUsername.bind(this)}
                     value={this.state.username} placeholder='请输入姓名'/>
            <ClInput title='密码' name='password' type='password' onChange={this.setPassword.bind(this)}
                     value={this.state.password} placeholder='请输入密码'/>
          </View>
        </View>
        <View style='display: flex;justify-content: center;align-items: center;' className='at-row'>
          <View style='margin-top:2vh'>
            <ClButton long shape={"radius"} size={"large"} formType="submit" onClick={this.login.bind(this)}
                      loading={this.state.loading}>登录</ClButton>
            {/*<AtButton type={"primary"} size={"small"} formType={"submit"} loading={this.state.loading}>注册</AtButton>*/}
          </View>
        </View>
      </View>
    )
  }


}
