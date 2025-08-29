import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import icon_search from '../../assets/icon_search.png';
import icon_arrow from '../../assets/icon_arrow.png';

export default () => {
  const [showBack, setShowBack] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => {
      setShowBack(true);
      inputRef.current?.focus();
    }, 100);
  }, []);

  const renderTitle = () => {
    return (
      <View style={styles.titleLayout}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              inputRef.current?.blur();
              navigation.pop();
            }}
          >
            <Image style={styles.backImg} source={icon_arrow} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchLayout}>
          <Image style={styles.searchIcon} source={icon_search} />
          <TextInput
            ref={inputRef}
            style={styles.searchTxt}
            placeholder="口红"
            placeholderTextColor="#bbb"
          />
        </TouchableOpacity>
        <Text style={styles.searchButton}>搜索</Text>
      </View>
    );
  };
  return (
    <TouchableOpacity
      style={styles.root}
      activeOpacity={1}
      onPress={() => {
        inputRef.current?.blur();
        navigation.pop();
      }}
    >
      <View>{renderTitle()}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  titleLayout: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  backButton: {
    height: '100%',
    justifyContent: 'center',
  },
  backImg: {
    width: 20,
    height: 20,
  },
  searchLayout: {
    height: 32,
    flex: 1,
    backgroundColor: '#ddd',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginLeft: 16,
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  searchTxt: {
    fontSize: 16,
    color: '#bbb',
    marginLeft: 6,
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  searchButton: {
    marginLeft: 16,
  },
});
