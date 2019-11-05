import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {ClForm, ClFormItem, ClInput, ClButton, ClSelect, ClFlex} from 'mp-colorui'
import {AtMessage} from 'taro-ui'
import {hostname} from "../../config/proxy";

class editUser extends Taro.Component {

  config = {
    navigationBarTitleText: '编辑我的信息'
  };

  constructor() {
    super(...arguments);
    this.state = {
      email: '',
      wechat: '',
      phone_number: '',
      qq_number: '',
      student_id: '',
      major: '',
      grade: '',

      gradeSelectValue: 0,
      majorSelectValue: 0,
    }
  }

  componentDidMount() {
    this.setMyInformation()
  }

  setMyInformation() {
    Taro.request({
      url: hostname + 'user/myself/',
      header: {
        'Cookie': Taro.getStorageSync('cookies'),
      },
      method: 'GET'
    }).then(res => {
      this.setState({
        student_id: res.data.myDetail.student_id,
        grade: res.data.myDetail.grade,
        major: res.data.myDetail.major,
        email: res.data.myDetail.email,
        phone_number: res.data.myDetail.phone_number,
        qq_number: res.data.myDetail.qq_number,
        wechat: res.data.myDetail.wechat
      }, () => {
        switch (this.state.major) {
          case '软件工程':
            this.setState({
              majorSelectValue: 0
            });
            break;
          case '计算机科学与技术':
            this.setState({
              majorSelectValue: 1
            });
            break;
          case '电子信息科学与技术':
            this.setState({
              majorSelectValue: 2
            });
            break;
          case '数字媒体技术':
            this.setState({
              majorSelectValue: 3
            });
            break;
          case '计算机科学与技术(2+2)':
            this.setState({
              majorSelectValue: 4
            });
            break;
          default:
            this.setState({
              majorSelectValue: 0
            });
        }
        switch (this.state.grade) {
          case '17':
            this.setState({
              gradeSelectValue: 0
            });
            break;
          case '18':
            this.setState({
              gradeSelectValue: 1
            });
            break;
          case '19':
            this.setState({
              gradeSelectValue: 2
            });
            break;
          default:
            this.setState({
              gradeSelectValue: 0
            });
        }
      })
    })
  }

  setStuId(e) {
    this.setState({
      student_id: e
    })
  }

  setEmail(e) {
    this.setState({
      email: e
    })
  }

  setPhoneNumber(e) {
    this.setState({
      phone_number: e
    })
  }

  setQQ(e) {
    this.setState({
      qq_number: e
    })
  }

  setWechat(e) {
    this.setState({
      wechat: e
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

  setMajor(e) {
    switch (e) {
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

  changeUserInfo() {
    Taro.request({
      url: hostname + '/user/myself/',
      method: 'PUT',
      header: {
        'Cookie': Taro.getStorageSync('cookies'),
        'Content-Type': 'application/json'
      },
      data: {
        email: this.state.email,
        phone_number: this.state.phone_number,
        wechat: this.state.wechat,
        qq_number: this.state.qq_number,
        student_id: this.state.student_id,
        major: this.state.major,
        grade: this.state.grade
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '修改成功',
          'type': 'success'
        });
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


  render() {
    const gradeSelect = ['17', '18', '19'];
    const majorSelect = ['软件工程', '计算机科学与技术', '电子信息科学与技术', '数字媒体技术', '计算机科学与技术(2+2)'];
    return (
      <View>
        <AtMessage/>
        <View style='margin-top: 8vh; margin-bottom: 1vh;'>
          <ClForm>
            <ClFormItem required>
              <ClInput title='邮箱' name='email' type='email' onChange={this.setEmail.bind(this)}
                       value={this.state.email} defaultValue={this.state.email} placeholder='请输入邮箱' titleWidth='100px'/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='学号' name='student_id' type='number' onChange={this.setStuId.bind(this)}
                       value={this.state.student_id} defaultValue={this.state.student_id} placeholder='请输入学号'
                       titleWidth='100px' maxLength={15}/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='QQ' name='qq_number' type='number' onChange={this.setQQ.bind(this)}
                       value={this.state.qq_number} defaultValue={this.state.qq_number} placeholder='请输入QQ号'
                       titleWidth='100px' maxLength={15}/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='手机' name='phone_number' type='number' onChange={this.setPhoneNumber.bind(this)}
                       value={this.state.phone_number} defaultValue={this.state.phone_number} placeholder='请输入手机号'
                       titleWidth='100px' maxLength={20}/>
            </ClFormItem>
            <ClFormItem required>
              <ClInput title='微信' name='wechat' type='text' onChange={this.setWechat.bind(this)}
                       value={this.state.wechat} defaultValue={this.state.wechat} placeholder='请输入微信号'
                       titleWidth='100px' maxLength={30}/>
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
                  <ClButton shape={"radius"} size={"large"} onClick={this.changeUserInfo.bind(this)}>修改</ClButton>
                </View>
              </ClFlex>
            </View>
          </ClForm>
        </View>
      </View>
    );
  }
}
