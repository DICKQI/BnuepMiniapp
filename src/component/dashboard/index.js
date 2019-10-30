import Taro from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtMessage, AtAvatar} from 'taro-ui'
import {ClText, ClCard, ClButton, ClFlex} from 'mp-colorui'
import {hostname} from "../../config/proxy";
import './index.scss'

class Dashboard extends Taro.Component {

  config = {
    navigationBarTitleText: '我的'
  };

  constructor() {
    super(...arguments);
    this.state = {
      name: '',
      student_id: '',
      grade: '',
      major: '',
      email: '',
      contest: [],
      empty: true
    }
  }

  componentWillMount() {
    this.getMyInformation();
  }

  getMyInformation() {
    Taro.request({
      url: hostname + 'user/myself/',
      header: {
        'Cookie': Taro.getStorageSync('cookies'),
      },
      method: 'GET'
    }).then(res => {
      for (var i = 0; i < res.data.MyContest.length; i++) {
        this.state.contest.push(res.data.MyContest[i]);
        this.setState({
          contest: this.state.contest
        })
      }
      if (res.data.MyContest.length !== 0) {
        this.setState({
          empty: false
        })
      }
      this.setState({
        name: res.data.myDetail.name,
        student_id: res.data.myDetail.student_id,
        grade: res.data.myDetail.grade,
        major: res.data.myDetail.major,
        email: res.data.myDetail.email
      })
    })
  }

  toContestDetail(cid) {
    Taro.navigateTo({
      url: '/pages/contest/contestDetail?cid=' + cid
    })
  }

  logout() {
    Taro.request({
      url: hostname + 'user/',
      header: {
        'Cookie': Taro.getStorageSync('cookies'),
      },
      method: 'DELETE'
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.removeStorageSync('cookies'); // 移除cookies
        Taro.atMessage({
          'message': '登出成功',
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
        <View style='margin-top:5vh; margin-left: 2vh' className='at-row'>
          <View className='at-col'>
            <AtAvatar openData={
              {type: 'userAvatarUrl'}
            } size={"large"}/>
          </View>
          <View className='at-col' style='margin-top:1vh;'>
            <View>
              <ClText
                text={this.state.name}
                size={"xlarge"}/>
            </View>
            <View>
              <ClText
                text={this.state.student_id}
                size={"xlarge"}/>
            </View>
          </View>
          <View className='at-col' style='margin-left: 15vh; margin-top: -1vh'>
            <View>
              <ClButton shape={"radius"} onClick={this.logout.bind(this)} bgColor={"blue"}>登出</ClButton>
            </View>
            <View style='margin-top: 1vh;'>
              <ClButton shape={"radius"} bgColor={"blue"}>编辑</ClButton>
            </View>
          </View>
        </View>
        <View style='margin-top: 3vh'>
          <ClText align={"center"} text='我参加的比赛' bgColor={"gradualGreen"}/>
          {
            this.state.empty ?
              <View style='margin-top: 5vh'>
                <ClText text={'你还没有参加任何比赛噢'} textColor={"gray"} align={"center"}/>
              </View>
              :
              this.state.contest.map((item, index) => {
                return <View key={index} onClick={this.toContestDetail.bind(this, item.id)}>
                  <ClCard active>
                    <ClText textColor={"blue"} text={item.contestName} size={"xxlarge"}/>
                    <View>比赛开始时间：{item.beginTime}</View>
                    <View>比赛截止时间：{item.signupEndTime}</View>
                    <View>主办方：{item.sponsor}</View>
                    <View>承办方：{item.organizer}</View>
                  </ClCard>
                </View>
              })
          }
        </View>
      </View>
    );
  }


}

export default Dashboard
