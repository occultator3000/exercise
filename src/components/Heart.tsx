import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
} from 'react-native';

import icon_heart from '../assets/icon_heart.png';
import icon_heart_empty from '../assets/icon_heart_empty.png';

type Props = {
  value: boolean;
  onValueChanged?: (value: boolean) => void;
  size?: number;
};

export default (props: Props) => {
  const { value, onValueChanged, size = 20 } = props;

  const [showState, setShowState] = useState<boolean>(false);

  const scale = useRef<Animated.Value>(new Animated.Value(0)).current; //放大动画

  const alpha = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    setShowState(value);
  }, [value]);

  const onHeartPress = () => {
    const newState = !showState;
    setShowState(newState);
    onValueChanged?.(newState);
    if (newState) {
      alpha.setValue(1);
      const scaleAnim = Animated.timing(scale, {
        toValue: 1.6,
        duration: 300,
        useNativeDriver: false,
      });
      const alphaAnim = Animated.timing(alpha, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
        delay:200,
      });

      Animated.parallel([scaleAnim, alphaAnim]).start();//同步动画执行
    } else {
      scale.setValue(0);
      alpha.setValue(0);
    }
  };

  return (
    <TouchableOpacity onPress={onHeartPress}>
      <Image
        style={[styles.container, { width: size, height: size }]}
        source={showState ? icon_heart : icon_heart_empty}
      />
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 20,
          position: 'absolute', //放在图片上面
          borderColor: '#ff2442',
          transform: [{ scale: scale }],
          opacity: alpha,//透明度
        }}
      ></Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
