import Taro from '@tarojs/taro'
import {View, Picker} from '@tarojs/components'
import {AtMessage} from 'taro-ui'
import {hostname} from "../../config/proxy";
import {ClInput, ClButton, ClSelect, ClFlex, ClForm, ClFormItem} from 'mp-colorui'


class register extends Taro.Component {

  config = {
    navigationBarTitleText: '欢迎参加比赛'
  };

  constructor() {

    super(...arguments);
    this.state = {
      name: '',
      password: '',
      grade: '17',
      major: '软件工程',
      email: '',
      qq_number: '',
      phone_number: '',
      student_id: '',
      wechat: '',

      // select value
      gradeSelectValue: 0,
      majorSelectValue: 0,
    }
  }


  register() {
    if (this.state.name === '') {
      Taro.atMessage({
        'message': '姓名不能为空',
        'type': 'error'
      });
      return
    } else if (this.state.password === '') {
      Taro.atMessage({
        'message': '密码不能为空',
        'type': 'error'
      });
      return
    } else if (this.state.email === '') {
      Taro.atMessage({
        'message': '邮箱不能为空',
        'type': 'error'
      });
      return
    } else if (this.state.qq_number === '') {
      Taro.atMessage({
        'message': 'QQ号不能为空',
        'type': 'error'
      });
      return
    } else if (this.state.phone_number === '') {
      Taro.atMessage({
        'message': '手机号不能为空',
        'type': 'error'
      });
      return
    } else if (this.state.student_id === '') {
      Taro.atMessage({
        'message': '学号不能为空',
        'type': 'error'
      });
      return
    } else if (this.state.wechat === '') {
      Taro.atMessage({
        'message': '微信号不能为空',
        'type': 'error'
      });
    }
    Taro.request({
      url: hostname + 'user/register/',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        name: this.state.name,
        password: this.state.password,
        grade: this.state.grade,
        major: this.state.major,
        email: this.state.email,
        qq: this.state.qq_number,
        phone_number: this.state.phone_number,
        wechat: this.state.wechat,
        studentId: this.state.student_id
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '注册成功',
          'type': 'success'
        });
        this.login();
        setTimeout(() => {
          Taro.reLaunch({
            'url': '/pages/index/index'
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

  setName(e) {
    this.setState({
      name: e
    })
  }

  setPassword(e) {
    this.setState({
      password: e
    })
  }

  setGrade(e) {
    switch (e) {
      case '0':
        this.setState({
          grade: '17',
          gradeSelectValue: 0
        });
        break;
      case '1':
        this.setState({
          grade: '18',
          gradeSelectValue: 1
        });
        break;
      case '2':
        this.setState({
          grade: '19',
          gradeSelectValue: 2
        });
        break;
    }
  }

  setMajor(e1) {
    switch (e1) {
      case '0':
        this.setState({
          major: '软件工程',
          majorSelectValue: 0
        });
        break;
      case '1':
        this.setState({
          major: '计算机科学与技术',
          majorSelectValue: 1
        });
        break;
      case '2':
        this.setState({
          major: '电子信息科学与技术',
          majorSelectValue: 2
        });
        break;
      case '3':
        this.setState({
          major: '数字媒体技术',
          majorSelectValue: 3
        });
        break;
      case '4':
        this.setState({
          major: '计算机科学与技术(2+2)',
          majorSelectValue: 4
        });
    }
  }

  setEmail(e) {
    this.setState({
      email: e
    })
  }

  setQQ(e) {
    this.setState({
      qq_number: e
    })
  }

  setPhone(e) {
    this.setState({
      phone_number: e
    })
  }

  setWechat(e) {
    this.setState({
      wechat: e
    })
  }


  setStudentID(e) {
    this.setState({
      student_id: e
    })
  }

  login() {
    Taro.request({
      url: hostname + 'user/',
      method: 'POST',
      data: {
        name: this.state.name,
        password: this.state.password
      },
      header: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      Taro.setStorageSync('cookies', res.header['Set-Cookie']);
    })
  }


  render() {
    const gradeSelect = ['17', '18', '19'];
    const majorSelect = ['软件工程', '计算机科学与技术', '电子信息科学与技术', '数字媒体技术', '计算机科学与技术(2+2)'];
    return (
      <View>
        <AtMessage/>
        <View style='margin-top: 8vh; margin-bottom: 1vh;'>
          <ClForm>
            <ClFormItem required>
              <ClInput title='姓名' name='username' type='text' onChange={this.setName.bind(this)}
                       value={this.state.name} placeholder='请输入姓名' titleWidth='100px' maxLength={10}/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='密码' name='password' type='password' onChange={this.setPassword.bind(this)}
                       value={this.state.password} placeholder='请输入密码' titleWidth='100px' maxLength={100}/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='邮箱' name='email' type='email' onChange={this.setEmail.bind(this)}
                       value={this.state.email} placeholder='请输入邮箱' titleWidth='100px'/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='学号' name='student_id' type='number' onChange={this.setStudentID.bind(this)}
                       value={this.state.student_id} placeholder='请输入学号' titleWidth='100px' maxLength={15}/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='QQ' name='qq_number' type='number' onChange={this.setQQ.bind(this)}
                       value={this.state.qq_number} placeholder='请输入QQ号' titleWidth='100px' maxLength={15}/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='手机' name='phone_number' type='number' onChange={this.setPhone.bind(this)}
                       value={this.state.phone_number} placeholder='请输入手机号' titleWidth='100px' maxLength={20}/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='微信' name='wechat' type='text' onChange={this.setWechat.bind(this)}
                       value={this.state.wechat} placeholder='请输入微信号' titleWidth='100px' maxLength={30}/>
            </ClFormItem>
            <ClFormItem required>
              <ClSelect selector={{range: gradeSelect, value: this.state.gradeSelectValue}} mode={"selector"}
                        title={'选择年级'}
                        onChange={this.setGrade.bind(this)}/>
            </ClFormItem>
            <ClFormItem required>
              <ClSelect selector={{range: majorSelect, value: this.state.majorSelectValue}} mode={"selector"}
                        title={'选择专业'}
                        onChange={this.setMajor.bind(this)}/>
            </ClFormItem>
            <View style='margin-top:2vh'>
              <ClFlex justify={"center"}>
                <View style='margin-right: 2vh;'>
                  <ClButton shape={"radius"} size={"large"} onClick={this.register.bind(this)}>注册</ClButton>
                </View>
              </ClFlex>
            </View>
          </ClForm>
        </View>

      </View>
    );
  }
}
