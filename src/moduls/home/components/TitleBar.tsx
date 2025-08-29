import React, {useEffect, useState} from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

import icon_daily from '../../../assets/icon_daily.png';
import icon_search from '../../../assets/icon_search.png';

type Props = {
    tab:number;
    onTabChanged?:(tab:number)=>void;
}

export default ({tab,onTabChanged}:Props) => {
  const [tabIndex, setTabIndex] = useState<number>(1);

  useEffect(() => {
    setTabIndex(tab);
  }, [tab]);
  
  return (
    <View style={styles.titleLayout}>
      <TouchableOpacity style={styles.dailyButton}>
        <Image style={styles.icon} source={icon_daily} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => {
          setTabIndex(0);
          onTabChanged?.(0);
        }}
      >
        <Text style={tabIndex === 0 ? styles.tabTxtSelect : styles.tabTxt}>
          关注
        </Text>
        {tabIndex === 0 && <View style={styles.line} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => {
          setTabIndex(1);
          onTabChanged?.(1);
        }}
      >
        <Text style={tabIndex === 1 ? styles.tabTxtSelect : styles.tabTxt}>
          发现
        </Text>
        {tabIndex === 1 && <View style={styles.line} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => {
          setTabIndex(2);
          onTabChanged?.(2);
        }}
      >
        <Text style={tabIndex === 2 ? styles.tabTxtSelect : styles.tabTxt}>
          福州
        </Text>
        {tabIndex === 2 && <View style={styles.line} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.searchButton}>
        <Image style={styles.icon} source={icon_search} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleLayout: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16, //左右内边距
  },
  icon: {
    width: 26,
    height: 26,
  },
  dailyButton: {
    paddingRight: 12, // 增大点击区域
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 46,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12, // 增大点击区域
    height: '100%',
    marginLeft: 46,
  },
  tabButton: {
    flex: 1, //平分剩余空间
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTxt: {
    fontSize: 15,
    color: '#999',
  },
  tabTxtSelect: {
    fontSize: 17,
    color: '#333',
  },
  line: {
    width: 28,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    bottom: 6,
    backgroundColor: '#ff2442',
  },
});
