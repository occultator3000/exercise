import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

type Props = {
  uri: string;
};

const { width: SCREEN_WIDTH} = Dimensions.get('window');
const SHOW_WIDTH = (SCREEN_WIDTH - 18) >> 1;

export default ({ uri }: Props) => {
  const [height, setHeight] = useState<number>(200);

  useEffect(() => {
    Image.getSize(uri, (width: number, height: number) => {
      const showHeight = (SHOW_WIDTH * height) / width;
      setHeight(showHeight);
    });
  }, [uri]);

  return (
    <Image style={[styles.image, { height: height }]} source={{ uri: uri }} />
  );
};

const styles = StyleSheet.create({
  image: {
    width: SHOW_WIDTH,
    resizeMode: 'cover',
    borderRadius:6,
  },
});
