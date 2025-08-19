import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  TextInput,
  LayoutAnimation,
} from 'react-native';

import icon_main_logo from '../../assets/icon_main_logo.png';
import icon_unselected from '../../assets/icon_unselected.png';
import icon_selected from '../../assets/icon_selected.png';
import icon_arrow from '../../assets/icon_arrow.png';
import icon_wx_small from '../../assets/icon_wx_small.png';
import icon_triangle from '../../assets/icon_triangle.png';
import icon_eye_open from '../../assets/icon_eye_open.png';
import icon_eye_close from '../../assets/icon_eye_close.png';
import icon_exchange from '../../assets/icon_exchange.png';
import icon_wx from '../../assets/icon_wx.png';
import icon_qq from '../../assets/icon_qq.webp';
import icon_close_modal from '../../assets/icon_close_modal.png';

export default () => {
  const [loginType, setLoginType] = useState<'quick' | 'input'>('quick'); //默认快捷登录
  const [check, setCheck] = useState(false); //协议勾选状态
  const [eyeOpen, setEyeOpen] = useState(false); //密码可见状态

  const renderQuickLogin = () => {
    const styles = StyleSheet.create({
      root: {
        width: '100%',
        height: '100%',
        flexDirection: 'column-reverse', //底部对齐
        alignItems: 'center',
        paddingHorizontal: 56,
      },
      otherLoginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 100,
      },
      otherLoginTxt: {
        fontSize: 14,
        color: '#303080',
      },
      icon_arrow: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginLeft: 7,
        transform: [{ scaleX: -1 }], // 👈 水平翻转
      },
      wxLoginButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#05c120',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      wxLoginTxt: {
        fontSize: 18,
        color: 'white',
        marginLeft: 6,
      },
      icon_wx: {
        width: 40,
        height: 40,
      },
      oneKeyLoginButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#ff2442',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
      },
      oneKeyLoginTxt: {
        fontSize: 18,
        color: 'white',
        marginLeft: 6,
      },
      logo_main: {
        width: 180,
        height: 95,
        resizeMode: 'contain',
        position: 'absolute',
        top: 170,
      },
    });

    return (
      <View style={styles.root}>
        {/*协议部分*/}
        <View style={[totalStyles.protocolLayout, { marginBottom: 40 }]}>
          <TouchableOpacity
            onPress={() => {
              setCheck(!check);
            }}
          >
            <Image
              style={totalStyles.radioButton}
              source={check ? icon_selected : icon_unselected}
            />
          </TouchableOpacity>
          <Text style={totalStyles.labelTxt}>我已阅读并同意</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://www.baidu.com'); //协议跳转用百度网址模拟
            }}
          >
            <Text style={totalStyles.protocolTxt}>
              《用户协议》和《隐私政策》
            </Text>
          </TouchableOpacity>
        </View>
        {/*其他登录方式*/}
        <TouchableOpacity
          style={styles.otherLoginButton}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setLoginType('input');
          }}
        >
          <Text style={styles.otherLoginTxt}>其他登录方式</Text>
          <Image style={styles.icon_arrow} source={icon_arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.wxLoginButton} activeOpacity={0.7}>
          <Image style={styles.icon_wx} source={icon_wx_small} />
          <Text style={styles.wxLoginTxt}>微信登录</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.oneKeyLoginButton} activeOpacity={0.7}>
          <Text style={styles.oneKeyLoginTxt}>一键登录</Text>
        </TouchableOpacity>
        <Image style={styles.logo_main} source={icon_main_logo} />
      </View>
    );
  };
  const renderInputLogin = () => {
    const styles = StyleSheet.create({
      root: {
        width: '100%',
        height: '100%',
        flexDirection: 'column', //顶部对齐
        alignItems: 'center',
        paddingHorizontal: 48,
      },
      pwdLogin: {
        fontSize: 28,
        color: '#333',
        fontWeight: 'bold',
        marginTop: 56,
      },
      tips: {
        color: '#bbb',
        fontSize: 14,
        marginTop: 6,
      },
      phoneLayout: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 20,
      },
      pre86: {
        color: '#999',
        fontSize: 24,
      },
      triangle: {
        width: 12,
        height: 6,
        marginLeft: 4,
      },
      phoneInput: {
        flex: 1,
        height: 60,
        backgroundColor: 'transparent',
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 24,
        color: '#333',
        marginLeft: 16,
      },
      pwdLayout: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 8,
      },
      pwdInput: {
        marginLeft: 0,
        marginRight: 16,
      },
      iconEye: {
        width: 30,
        height: 30,
      },
      changeLayout: {
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
      },
      codeLoginTxt: {
        fontSize: 14,
        color: '#303080',
        flex: 1,
        marginLeft: 4,
      },
      exchangeIcon: {
        width: 16,
        height: 16,
      },
      forgetPwdTxt: {
        fontSize: 14,
        color: '#303080',
        //因为codeLoginTxt设置flex:1，撑满剩余父容器位置，自然而然将forgetPwdTxt移动至右边
      },
      loginButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#ff2442',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
        marginTop: 20,
      },
      loginTxt: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
      },
      wxqqLayout: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 60,
        justifyContent: 'center',
      },
      icon_wx: {
        width: 50,
        height: 50,
        marginRight: 60,
      },
      icon_qq: {
        width: 50,
        height: 50,
        marginLeft: 60,
      },
      closeButton: {
        position: 'absolute',
        left: 36,
        top: 24,
      },
      closeImg: {
        width: 28,
        height: 28,
      },
    });

    return (
      <View style={styles.root}>
        <Text style={styles.pwdLogin}>密码登录</Text>
        <Text style={styles.tips}>未注册的手机号登录成功后将自动注册</Text>
        <View style={styles.phoneLayout}>
          <Text style={styles.pre86}>+86</Text>
          <Image style={styles.triangle} source={icon_triangle} />
          <TextInput
            style={styles.phoneInput}
            placeholder="请输入手机号码"
            placeholderTextColor="#bbb"
            keyboardType="phone-pad"
            autoFocus={false} //自动聚焦设为false
            maxLength={11} //手机号长度限制
          />
        </View>
        <View style={styles.pwdLayout}>
          <TextInput
            style={[styles.phoneInput, styles.pwdInput]}
            placeholder="请输入密码"
            placeholderTextColor="#bbb"
            keyboardType="default"
            autoFocus={false} //自动聚焦设为false
          />
          <TouchableOpacity
            onPress={() => {
              setEyeOpen(!eyeOpen);
            }}
          >
            <Image
              style={styles.iconEye}
              source={eyeOpen ? icon_eye_open : icon_eye_close}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.changeLayout}>
          <Image style={styles.exchangeIcon} source={icon_exchange} />
          <TouchableOpacity style={{ flex: 1 }}>
            <Text style={styles.codeLoginTxt}>验证码登陆登录</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgetPwdTxt}>忘记密码？</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} activeOpacity={0.7}>
          <Text style={styles.loginTxt}>登录</Text>
        </TouchableOpacity>
        {/*协议部分*/}
        <View style={[totalStyles.protocolLayout, { marginTop: 12 }]}>
          <TouchableOpacity
            onPress={() => {
              setCheck(!check);
            }}
          >
            <Image
              style={totalStyles.radioButton}
              source={check ? icon_selected : icon_unselected}
            />
          </TouchableOpacity>
          <Text style={totalStyles.labelTxt}>我已阅读并同意</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://www.baidu.com'); //协议跳转用百度网址模拟
            }}
          >
            <Text style={totalStyles.protocolTxt}>
              《用户协议》和《隐私政策》
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wxqqLayout}>
          <Image source={icon_wx} style={styles.icon_wx} />
          <Image source={icon_qq} style={styles.icon_qq} />
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setLoginType('quick');
            LayoutAnimation.easeInEaseOut();
          }}
        >
          <Image style={styles.closeImg} source={icon_close_modal} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      {loginType === 'quick' ? renderQuickLogin() : renderInputLogin()}
    </View>
  );
};

const totalStyles = StyleSheet.create({
  protocolLayout: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
  },
  labelTxt: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  protocolTxt: {
    fontSize: 12,
    color: '#1020ff',
  },
});
