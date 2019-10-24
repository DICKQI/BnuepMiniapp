import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtTabBar} from 'taro-ui'
import {ClCard, ClText} from 'mp-colorui'
import './index.scss'
import {hostname} from "../../config/proxy";

export default class Index extends Component {

  config = {
    navigationBarTitleText: '计算机作品协会'
  };

  constructor() {
    super(...arguments);
    this.state = {
      contest: []
    }
  }

  componentWillMount() {
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
      }
    })
  }

  toContestDetail(cid) {
    Taro.navigateTo({
      url: '/pages/contest/contestDetail?cid=' + cid
    })
    // console.log(cid)
  }

  render() {
    return (
      <View className='index'>
        {
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
        }

      </View>
    )
  }
}
