import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtMessage, AtTabBar, AtModal} from 'taro-ui'
import {ClAccordion, ClLayout, ClCard, ClText, ClButton, ClDrawer, ClInput} from 'mp-colorui'
import {hostname} from "../../config/proxy";

class contestMyTeamDetail extends Taro.Component {


  config = {
    navigationBarTitleText: '我的队伍嗷'
  };

  constructor() {
    super(...arguments);
    this.state = {
      team: [],
      chooseTid: 0,
      showDrawer: false,
      works_link: ''
    }
  }

  componentWillMount() {
    this.loadMyContestInformation();
  }

  loadMyContestInformation() {
    Taro.showLoading({
      'title': '加载中'
    });
    Taro.request({
      url: hostname + 'user/myteam/' + this.$router.params.cid + '/',
      header: {
        'Cookie': Taro.getStorageSync('cookies')
      }
    }).then(res => {

      if (res.statusCode === 200) {
        for (var i = 0; i < res.data.team.length; i++) {
          this.state.team.push(res.data.team[i]);
          this.setState({
            team: this.state.team,
          });
        }
        Taro.hideLoading();
      }
    })
  }

  openDrawer(tid) {
    this.setState({
      showDrawer: true,
      chooseTid: tid
    })
  }

  closeDrawer() {
    this.setState({
      showDrawer: false
    })
  }

  setLink(e) {
    this.setState({
      works_link: e
    })
  }

  uploadWorkLink() {
    Taro.request({
      url: hostname + 'user/myteam/' + this.$router.params.cid + '/' + this.state.chooseTid + '/',
      method: 'PUT',
      header: {
        'Cookie': Taro.getStorageSync('cookies')
      },
      data: {
        link: this.state.works_link
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          showDrawer: false
        });
        Taro.atMessage({
          'message': '提交成功',
          'type': 'success'
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
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
        <ClDrawer show={this.state.showDrawer} direction={"bottom"} onCancel={this.closeDrawer.bind(this)}>
          <View style='margin-top: 1vh'>
            <ClText size={"xxlarge"} text={'请按照以下规范提交作品'} align={"center"}/></View>
          <View style='margin-top: 1vh;'>
            <ClText size={"large"} text={
              '    请将源码、文档与截图视频等文件，打包成zip或者rar文件，以小组名来命名，上传到百度网盘。将百度网盘分享链接以及提取码和解压密码（如果有）粘贴到下面的输入框中'
            }/>
          </View>
          <View style='margin-bottom: 25%;margin-top:3vh;'>
            <ClInput adjustPosition type={"text"} placeholder={'在此输入团队作品云盘链接与提取码'} value={this.state.works_link}
                     onChange={this.setLink.bind(this)}/>
            <View style='margin-top:2vh'>
              <ClFlex justify={"center"}>
                <View style='margin-right: 2vh;'>
                  <ClButton shape={"radius"} size={"large"} onClick={this.uploadWorkLink.bind(this)}>提交</ClButton>
                </View>
              </ClFlex>
            </View>
          </View>
        </ClDrawer>

        <View style='margin-bottom: 12vh; margin-top: 3vh;'>
          {
            this.state.team.map((item, index) => {
              return <View key={index}>
                <ClLayout margin={"normal"} marginDirection={"vertical"}>
                  <ClAccordion title={'作品名：' + item.works_name + '\n队伍名：' + item.team_name} card={true}
                               animation={true} speed={0.15}>
                    {
                      // 成员遍历
                      item.member.map((item2, index2) => {
                        return <View key={index2}>
                          <ClLayout padding={"small"} paddingDirection={"around"}>
                            <ClCard type={"full"}>
                              <View><ClText text={
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
                      item.leader ?
                        <ClButton bgColor={"gradualBlue"} long shape={"radius"}
                                  onClick={this.openDrawer.bind(this, item.id)}>提交作品</ClButton>
                        : ''
                    }
                  </ClAccordion>
                </ClLayout>
              </View>
            })
          }
        </View>

      </View>
    );
  }

}

