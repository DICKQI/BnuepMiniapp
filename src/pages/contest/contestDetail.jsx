import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import { AtMessage, AtTabBar} from 'taro-ui'
import {ClAccordion, ClLayout, ClCard, ClText, ClButton} from 'mp-colorui'
import {hostname} from "../../config/proxy";

class contestDetail extends Taro.Component {

  config = {
    navigationBarTitleText: "活动详情"
  };

  constructor() {
    super(...arguments);
    this.state = {
      team: [],
      contest_name: '',
      open: [],
      // message
      message: '',
      show: false,
      type: 'success',
    }
  }

  componentWillMount() {
    this.loadContestInformation();
  }

  loadContestInformation() {
    Taro.request({
      url: hostname + 'contest/' + this.$router.params.cid + '/',
      header: {
        'Cookie': Taro.getStorageSync('cookies')[0]
      }
    }).then(res => {
      if (res.statusCode === 200) {
        for (var i = 0; i < res.data.team.length; i++) {
          this.state.team.push(res.data.team[i]);
          this.state.open.push(false);
          this.setState({
            team: this.state.team,
            open: this.state.open
          })
        }
        this.setState({
          contest_name: res.data.contest_name
        })
      }
    })
  }

  joinTeam(tid) {
    var cid = this.$router.params.cid;
    Taro.request({
      url: hostname + 'contest/team/' + tid + '/' + cid + '/',
      header: {
        'Cookie': Taro.getStorageSync('cookies')[0]
      },
      method: 'GET'
    }).then(res => {
      if (res.statusCode === 200) {
        console.log(res.data);
        this.setState({
          contest_name: '',
          team: []
        });
        this.loadContestInformation()
      } else {
        Taro.atMessage({
          'message': res.data.errMsg,
          'type': 'error'
        })
      }
    })
  }

  createTeam() {
    Taro.navigateTo({
      url: '/pages/contest/createTeam?cid=' + this.$router.params.cid
    })
  }


  render() {
    return (
      <View>
        <AtMessage/>
        <View style='text-align: center;margin-top:3vh'>{this.state.contest_name} 当前队伍</View>
        <View>
          {
            this.state.team.map((item, index) => {
              return <View key={index}>
                <ClLayout margin={"normal"} marginDirection={"vertical"}>
                  <ClAccordion title={'作品名：' + item.works_name + '   队伍名：' + item.team_name} card={true}
                               animation={true} speed={0.3}>
                    {
                      item.member.map((item2, index2) => {
                        return <View key={index2}>
                          <ClLayout padding={"small"} paddingDirection={"around"}>
                            <ClCard type={"full"}>
                              <ClText text={item2.name} textColor={"black"}/>
                            </ClCard>
                          </ClLayout>
                        </View>
                      })
                    }
                    {
                      item.member_number !== 3 ?
                        <ClButton bgColor={"cyan"} long shape={"radius"}
                                  onClick={this.joinTeam.bind(this, item.id)}>加入队伍</ClButton>
                        : (
                          item.joined ?
                            <ClButton bgColor={"cyan"} long disabled={true} shape={"radius"}>你已经在此队伍</ClButton>
                            : <ClButton bgColor={"cyan"} long disabled={true} shape={"radius"}>队伍已满</ClButton>
                        )
                    }
                  </ClAccordion>
                </ClLayout>
              </View>
            })
          }
        </View>
        <AtTabBar current={1} tabList={[
          {title: '创建队伍', iconType: 'add-circle'}
        ]} onClick={this.createTeam.bind(this)} fixed/>
      </View>
    );
  }

}
