import Taro from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import {AtMessage, AtAvatar, AtCurtain} from 'taro-ui'
import {ClText, ClCard, ClButton, ClFlex} from 'mp-colorui'
import {hostname} from "../../config/proxy";
import './index.scss'
import code from '../../res/2dcode.jpeg'

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
      empty: true,

      show: false
    }
  }

  componentDidMount() {
    this.getMyInformation();
    Taro.setNavigationBarTitle({
      'title': '我的'
    })
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
      } else {
        this.setState({
          empty: true
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
      url: '/pages/contest/contestMyTeamDetail?cid=' + cid
    })
  }

  toChangeUserInfo() {
    Taro.navigateTo({
      url: '/pages/user/editUser'
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

  openCode() {
    this.setState({
      show: true
    })
  }

  onClose() {
    this.setState({
      show: false
    })
  }



  render() {
    return (
      <View>
        <AtMessage/>
        <AtCurtain onClose={this.onClose.bind(this)} isOpened={this.state.show}>
          <Image src={code} mode={"aspectFit"}/>
          <ClText text='请截图后添加微信' align={"center"} bgColor={"blue"} size={"xxlarge"}/>
        </AtCurtain>
        <View style='margin-top:5vh; margin-left: 2vh' className='at-row'>
          <View className='at-col'>
            <AtAvatar openData={
              {type: 'userAvatarUrl'}
            } size={"large"}/>
          </View>
          <View className='at-col'>
            <View>
              <ClText
                text={this.state.name}
                size={"large"}/>
            </View>
            <View>
              <ClText
                text={this.state.student_id}
                size={"large"}/>
            </View>
            <View style='margin-right: -7vh;'>
              <ClText
                text={this.state.major}
                size={"large"}/>
            </View>
          </View>
          <View className='at-col' style='margin-left: 15vh; margin-top: -1vh'>
            <View>
              <ClButton shape={"radius"} onClick={this.logout.bind(this)} bgColor={"gradualBlue"}>登出</ClButton>
            </View>
            <View style='margin-top: 1vh;'>
              <ClButton shape={"radius"} bgColor={"gradualBlue"} onClick={this.toChangeUserInfo.bind(this)}>编辑</ClButton>
            </View>
          </View>
        </View>
        <View style='margin-top: 3vh'>
          <ClText align={"center"} text='我参加的比赛' bgColor={"gradualBlue"}/>
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
        <View style='margin-top: 3vh; margin-bottom: 10vh;' onClick={this.openCode.bind(this)}>
          <ClText textColor={"grey"} text={'在使用过程中遇到的任何问题，可以在单击此处咨询开发者'} align={"center"}/>
        </View>
      </View>
    );
  }


}

export default Dashboard
