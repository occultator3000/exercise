import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import icon_group from '../../assets/icon_group.png';
import icon_create_group from '../../assets/icon_create_group.png';

export interface FloatMenuRef {
  show: (pageY:number) => void;
  hide: () => void;
}

export default forwardRef((props: any, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [y,setY] = useState<number>(100);
  
  const show = (pageY:number) => {
    console.log(pageY);
    setY(pageY);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  //使用useImperativeHandle对外暴露内部方法
  useImperativeHandle(ref, () => {
    return {
      show,
      hide,
    };
  });

  const renderMenus= () => {
    return(
        <View style={[styles.content,{top:y}]}>
            <TouchableOpacity style={styles.menuItem}>
                <Image style={styles.menuIcon} source={icon_group}/>
                <Text style={styles.menuTxt}>群聊广场</Text>
            </TouchableOpacity>
            <View style={styles.line}/>
            <TouchableOpacity style={styles.menuItem}>
                <Image style={styles.menuIcon} source={icon_create_group}/>
                <Text style={styles.menuTxt}>创建群聊</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      statusBarTranslucent={true} //让状态栏变成透明
      animationType="fade"
      onRequestClose={hide}
    >
      <TouchableOpacity style={styles.root} onPress = {hide}>
        {renderMenus()}
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000040',
  },
  content:{
    backgroundColor:'white',
    borderRadius:16,
    width:170,
    position:'absolute',
    right:24,
  },
  menuItem:{
    flexDirection:'row',
    height:48,
    marginLeft:20,
    width:'100%',
    alignItems:'center',
  },
  menuIcon:{
    width:28,
    height:28,
  },
  menuTxt:{
    fontSize:18,
    color:'#333',
    marginLeft:10,
  },
  line:{
    marginLeft:0,
    marginRight:16,
    height:1,
    backgroundColor:'#eee',
  },
});
