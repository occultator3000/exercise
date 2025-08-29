import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

type Props = {
    icon:number;
    tips:string;
};

export default ({icon,tips}:Props) => {
  return (
    <View style={styles.root}>
      <View style={styles.nonContent}>
        <Image style={styles.noContentImg} source={icon} />
        <View style={styles.nonContentTxtLayout}>
          <Text style={styles.nonContentTxt}>{tips}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  nonContent: {
    height: 400,
    alignItems: 'center',
  },
  noContentImg: {
    width: 80,
    height: 80,
    marginTop: 80,
    resizeMode: 'contain',
  },
  nonContentTxtLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  nonContentTxt: {
    fontSize: 12,
    color: '#999',
  },
});
