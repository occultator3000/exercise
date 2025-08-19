import React, {  } from 'react'
import { Text, View , TouchableOpacity,StyleSheet} from 'react-native'

import {useNavigation}from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export default () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const onButtonPress=()=>{
    navigation.push('Mine');
  }
    return (
      <View>
        <Text> HomePage </Text>
        <TouchableOpacity onPress={onButtonPress}>
          <View style={styles.blueView}>
            <Text>Go to Mine Page</Text>
          </View>
          
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
  blueView: {
    backgroundColor: 'blue',
  },
});
