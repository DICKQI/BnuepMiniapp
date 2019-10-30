import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtMessage} from 'taro-ui'
import {ClInput, ClButton, ClFlex} from 'mp-colorui'
import {hostname} from "../../config/proxy";
import {Dashboard} from '../dashboard/index'


class Login extends Component {

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
    }).then(res => {
      if (res.statusCode === 200) {
        // 设置cookies到缓存
        Taro.setStorageSync('cookies', res.header['Set-Cookie']);
        Taro.atMessage({
          'message': '欢迎回来',
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

  toRegister() {
    Taro.navigateTo({
      url: '/pages/user/register'
    })
  }

  render() {
    const {isLogin} = this.props;
    return (
      isLogin ?
        <Dashboard/>
        :
        <View>
          <AtMessage/>
          <View style='margin-top: 8vh; margin-bottom: 1vh;'>
            <ClInput title='姓名' name='username' type='text' onChange={this.setUsername.bind(this)}
                     value={this.state.username} placeholder='请输入姓名' titleWidth='100px'/>
            <ClInput title='密码' name='password' type='password' onChange={this.setPassword.bind(this)}
                     value={this.state.password} placeholder='请输入密码' titleWidth='100px'/>
          </View>
          <View style='margin-top:2vh'>
            <ClFlex justify={"center"}>
              <View style='margin-right: 2vh;'>
                <ClButton shape={"radius"} size={"large"} formType="submit" onClick={this.login.bind(this)}
                          loading={this.state.loading}>登录</ClButton>
              </View>
              <View style='margin-right: 2vh;'>
                <ClButton shape={"radius"} size={"large"} onClick={this.toRegister.bind(this)}>注册</ClButton>
              </View>
            </ClFlex>
          </View>
        </View>
    )
  }

}

export default Login
