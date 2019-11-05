import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtTabBar, AtMessage} from 'taro-ui'
import {ClCard, ClText} from 'mp-colorui'
import './index.scss'
import {hostname} from "../../config/proxy";
import {Login} from '../../component/Login/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '计算机作品协会',
    enablePullDownRefresh: true
  };

  constructor() {
    super(...arguments);
    this.state = {
      contest: [],
      current: 0,
      isLogin: false,
      contest_empty: true
    }
  }

  componentWillMount() {
    this.getContestList();
    this.checkLogin();
    // console.log(this.state.isLogin)
  }

  onPullDownRefresh() {
    // console.log(this.state.isLogin);
    Taro.showNavigationBarLoading();
    Taro.showLoading({title: '刷新中...'});
    this.setState({
      contest: []
    });
    this.getContestList();
    Taro.hideLoading();
    Taro.hideNavigationBarLoading();
    Taro.stopPullDownRefresh();
  }

  getContestList() {
    Taro.request({
      url: hostname + 'contest/list/'
    }).then(res => {
      if (res.statusCode === 200) {
        for (var i = 0; i < res.data.contest.length; i++) {
          this.state.contest.push(res.data.contest[i]);
          this.setState({
            contest: this.state.contest
          })
        }
        if (res.data.contest.length !== 0) {
          this.setState({
            contest_empty: false
          })
        } else {
          this.setState({
            contest_empty: true
          })
        }
      }
    })
  }

  checkLogin() {
    Taro.request({
      url: hostname + 'user/myself/',
      header: {
        'Cookie': Taro.getStorageSync('cookies'),
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          isLogin: true
        })
      } else {
        this.setState({
          isLogin: false
        })
      }
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  toContestDetail(cid) {
    console.log(this.state.isLogin);
    if (this.state.isLogin === false) {
      Taro.atMessage({
        'message': '你还未登录，请登录后再进行操作',
        'type': 'warning'
      })
    } else {
      Taro.navigateTo({
        url: '/pages/contest/contestDetail?cid=' + cid
      })
    }
  }

  render() {
    return (
      <View className='index'>
        <AtMessage/>
        <View style='margin-bottom:10vh;'>
        {
          this.state.current === 0 ?
            (
              this.state.contest_empty ?
                <View style='margin-top: 50%'>
                  <ClText text='现在还没有进行中的比赛噢' textColor={"gray"} align={"center"}/>
                </View>
                :
                this.state.contest.map((item, index) => {
                  return <View key={index} onClick={Index.toContestDetail.bind(this, item.id)}>
                    <ClCard active>
                      <ClText textColor={"blue"} text={item.contestName} size={"xxlarge"}/>
                      <View>比赛开始时间：{item.beginTime}</View>
                      <View>比赛截止时间：{item.signupEndTime}</View>
                      <View>主办方：{item.sponsor}</View>
                      <View>承办方：{item.organizer}</View>
                    </ClCard>
                  </View>
                })
            )
            :
            <Login isLogin={this.state.isLogin}/>
        }
        </View>
        <AtTabBar fixed current={this.state.current} tabList={[
          {title: '比赛', iconType: 'home'},
          {title: '我的', iconType: 'user'}
        ]} onClick={this.handleClick.bind(this)}/>
      </View>
    )
  }
}
