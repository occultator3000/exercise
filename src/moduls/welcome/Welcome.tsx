import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import icon_main_logo from '../../assets/icon_main_logo.png';

export default () => {

  const navigation=useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    setTimeout(() => {
        startLogin();
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLogin = () => {
    navigation.replace('Login');
  };
  return (
    <View style={styles.root}>
      <Image style={styles.logo_main} source={icon_main_logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo_main: {
    width: 230,
    height: 120,
    marginTop: 300,
  },
});
