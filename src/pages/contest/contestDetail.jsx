import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtMessage, AtTabBar, AtModal} from 'taro-ui'
import {ClAccordion, ClLayout, ClCard, ClText, ClButton} from 'mp-colorui'
import {hostname} from "../../config/proxy";

class contestDetail extends Taro.Component {


  constructor() {
    super(...arguments);
    this.state = {
      team: [],
      exitCheck: false,
      tid: 0,
      team_empty: true,
    }
  }

  componentWillMount() {
    this.loadContestInformation();
  }

  loadContestInformation() {
    Taro.showLoading({
      'title': '加载中'
    });
    Taro.request({
      url: hostname + 'contest/' + this.$router.params.cid + '/',
      header: {
        'Cookie': Taro.getStorageSync('cookies')
      }
    }).then(res => {

      if (res.statusCode === 200) {
        for (var i = 0; i < res.data.team.length; i++) {
          this.state.team.push(res.data.team[i]);
          this.setState({
            team: this.state.team,
          })
        }
        if (res.data.team.length !== 0) {
          this.setState({
            team_empty: false
          })
        } else {
          this.setState({
            team_empty: true
          })
        }
        Taro.setNavigationBarTitle({
          'title': res.data.contest_name
        });
        Taro.hideLoading();
      }
    })
  }

  joinTeam(tid) {
    var cid = this.$router.params.cid;
    Taro.request({
      url: hostname + 'contest/team/' + tid + '/' + cid + '/',
      header: {
        'Cookie': Taro.getStorageSync('cookies')
      },
      method: 'GET'
    }).then(res => {
      if (res.statusCode === 200) {
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

  leaveTeam() {
    Taro.request({
      url: hostname + 'contest/team/' + this.state.tid + '/' + this.$router.params.cid + '/',
      header: {
        'Cookie': Taro.getStorageSync('cookies')
      },
      method: 'DELETE'
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          contest_name: '',
          team: [],
          exitCheck: false
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


  closeMyModal() {
    this.setState({
      exitCheck: false,
      tid: 0
    })
  }

  openMyModal(tid) {
    this.setState({
      exitCheck: true,
      tid: tid
    })
  }


  render() {
    return (
      <View>
        <AtMessage/>
        <AtModal content='确定要退出队伍吗' confirmText='退出' cancelText='取消' isOpened={this.state.exitCheck}
                 onCancel={this.closeMyModal.bind(this)}
                 onClose={this.closeMyModal.bind(this)} onConfirm={this.leaveTeam.bind(this)}/>
        <View style='text-align: center;margin-top:3vh'>当前队伍</View>
        {
          this.state.team_empty ?
            <View style='margin-top: 50%;'>
              <ClText textColor={"grey"} text='竟然没有一支队伍参赛？？快来，大奖就是你的了' align={"center"}/>
            </View>
            :
            <View style='margin-bottom: 12vh;'>
              {
                this.state.team.map((item, index) => {
                  return <View key={index}>
                    <ClLayout margin={"normal"} marginDirection={"vertical"}>
                      <ClAccordion title={'作品名：' + item.works_name + '\n队伍名：' + item.team_name} card={true}
                                   animation={true} speed={0.15}>
                        {
                          item.member.map((item2, index2) => {
                            return <View key={index2}>
                              <ClLayout padding={"small"} paddingDirection={"around"}>
                                <ClCard type={"full"}>
                                  <View><ClText text={
                                    // item2.name
                                    item2.memberRoles === 'leader' ?
                                      item2.name + '(leader)' : item2.name
                                  }
                                                textColor={"black"}/></View>
                                </ClCard>
                              </ClLayout>
                            </View>
                          })
                        }
                        {
                          item.joined ?
                            <ClButton bgColor={"red"} long shape={"radius"}
                                      onClick={this.openMyModal.bind(this, item.id)}>退出队伍</ClButton>
                            : (item.member_number === 3 ?
                              <ClButton bgColor={"red"} long disabled={true} shape={"radius"}>队伍已满</ClButton>
                              :
                              <ClButton bgColor={"gradualGreen"} long shape={"radius"}
                                        onClick={this.joinTeam.bind(this, item.id)}>加入队伍</ClButton>
                            )
                        }
                      </ClAccordion>
                    </ClLayout>
                  </View>
                })
              }
            </View>
        }
        <AtTabBar current={1} tabList={[
          {title: '创建队伍', iconType: 'add-circle'}
        ]} onClick={this.createTeam.bind(this)} fixed/>
      </View>
    );
  }

}
