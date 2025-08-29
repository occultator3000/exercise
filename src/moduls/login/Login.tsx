import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  TextInput,
  Animated,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { formaPhone, replaceBlank } from '../../utils/StringUtil';
import UserStore from '../../stores/UserStore';
import Toast from '../../components/widget/Toast';

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
  const [loginType, setLoginType] = useState<'quick' | 'input'>('quick');
  const [check, setCheck] = useState(false);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [phone, setPhone] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');

  const navigation = useNavigation<StackNavigationProp<any>>();

  // 缩放动画
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 弹簧动画配置
  const springConfig = {
    tension: 20, // 张力，值越大动画越有力
    friction: 15, // 摩擦力，值越大动画越不"弹"
    useNativeDriver: true,
  };

  // 当登录类型变化时触发弹簧动画
  useEffect(() => {
    if (loginType === 'quick') {
      // 快捷登录模式 - 恢复正常大小
      Animated.spring(scaleAnim, {
        ...springConfig,
        toValue: 1,
      }).start();
    } else {
      // 输入登录模式 - 稍微缩小一点
      Animated.spring(scaleAnim, {
        ...springConfig,
        toValue: 0.95,
      }).start();
    }
  }, [loginType]);

  // 获取动画样式
  const getAnimatedStyles = () => {
    return {
      transform: [{ scale: scaleAnim }],
    };
  };

  const renderQuickLogin = () => {
    return (
      <Animated.View style={[styles.quickRoot, getAnimatedStyles()]}>
        {/* 协议部分 */}
        <View style={[totalStyles.protocolLayout, { marginBottom: 40 }]}>
          <TouchableOpacity onPress={() => setCheck(!check)}>
            <Image
              style={totalStyles.radioButton}
              source={check ? icon_selected : icon_unselected}
            />
          </TouchableOpacity>
          <Text style={totalStyles.labelTxt}>我已阅读并同意</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.baidu.com')}
          >
            <Text style={totalStyles.protocolTxt}>
              《用户协议》和《隐私政策》
            </Text>
          </TouchableOpacity>
        </View>

        {/* 其他登录方式 */}
        <TouchableOpacity
          style={styles.otherLoginButton}
          onPress={() => setLoginType('input')}
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
      </Animated.View>
    );
  };

  const canLogin = phone?.length === 13 && pwd?.length >= 6;

  const onLoginPress = async () => {
    if (!canLogin || !check) {
      //必须满足能登录且同意协议才能登录
      return;
    }
    //const purePhone = replaceBlank(phone);
    //navigation.replace('HomeTab');//登录跳转一定是replace

    // 去登陆
    // const params = {
    //   name: 'dagongjue',
    //   pwd: '123456',
    // };
    // const url='/user/login';
    // const {data} = await request('login', params);

    // console.log(`data=${JSON.stringify(data)}`);

    UserStore.requestLogin(replaceBlank(phone),pwd,(success:boolean)=>{
      if(success){
        navigation.replace('MainTab');//登录跳转一定是replace
      }else{
        Toast.show('登录失败，请检查手机号或密码');
      }
    })
  };

  const renderInputLogin = () => {
    return (
      <Animated.View style={[styles.inputRoot, getAnimatedStyles()]}>
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
            autoFocus={false}
            maxLength={13}
            value={phone}
            onChangeText={(text: string) => setPhone(formaPhone(text))}
          />
        </View>

        <View style={styles.pwdLayout}>
          <TextInput
            style={[styles.phoneInput, styles.pwdInput]}
            placeholder="请输入密码"
            placeholderTextColor="#bbb"
            keyboardType="default"
            autoFocus={false}
            secureTextEntry={!eyeOpen}
            value={pwd}
            onChangeText={(text: string) => setPwd(text)}
          />
          <TouchableOpacity onPress={() => setEyeOpen(!eyeOpen)}>
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

        <TouchableOpacity
          style={(canLogin && check) ? styles.loginButton : styles.loginButtonDisable}
          activeOpacity={canLogin ? 0.7 : 1}
          onPress={() => {
            onLoginPress();
          }}
        >
          <Text style={styles.loginTxt}>登录</Text>
        </TouchableOpacity>

        {/* 协议部分 */}
        <View style={[totalStyles.protocolLayout, { marginTop: 12 }]}>
          <TouchableOpacity onPress={() => setCheck(!check)}>
            <Image
              style={totalStyles.radioButton}
              source={check ? icon_selected : icon_unselected}
            />
          </TouchableOpacity>
          <Text style={totalStyles.labelTxt}>我已阅读并同意</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.baidu.com')}
          >
            <Text style={totalStyles.protocolTxt}>
              《用户协议》和《隐私政策》
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.wxqqLayout}>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={icon_wx} style={styles.icon_wx} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={icon_qq} style={styles.icon_qq} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setLoginType('quick')}
        >
          <Image style={styles.closeImg} source={icon_close_modal} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {loginType === 'quick' ? renderQuickLogin() : renderInputLogin()}
    </View>
  );
};

// 总样式
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

// 主要样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 快捷登录样式
  quickRoot: {
    width: '100%',
    height: '100%',
    flexDirection: 'column-reverse',
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
    transform: [{ scaleX: -1 }],
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
    width: 50,
    height: 50,
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

  // 输入登录样式
  inputRoot: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
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
  loginButtonDisable: {
    width: '100%',
    height: 56,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    marginTop: 20,
  },
  loginTxt: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  wxqqLayout: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 60,
    justifyContent: 'center',
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
