import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';

import { save } from '../../../utils/Storage';

import icon_arrow from '../../../assets/icon_arrow.png';
import icon_delete from '../../../assets/icon_delete.png';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  categoryList: Category[];
};

export interface CategoryModalRef {
  show: () => void;
  hide: () => void;
}

export default forwardRef((props: Props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const { categoryList } = props;

  const [myList, setMyList] = useState<Category[]>([]);
  const [otherList, setOtherList] = useState<Category[]>([]);

  //添加动画
  const [itemAnims, setItemAnims] = useState<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    if (!categoryList) {
      return;
    }

    const list1 = categoryList.filter(i => i.isAdd);
    const list2 = categoryList.filter(i => !i.isAdd);

    setMyList(list1);
    setOtherList(list2);
  }, [categoryList]);

  const show = () => {
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

  useEffect(() => {
    const allItems = [...myList, ...otherList];
    setItemAnims(anims => {
      const newAnims = { ...anims };
      allItems.forEach(item => {
        if (!newAnims[item.name]) {
          newAnims[item.name] = new Animated.Value(1);
        }
      });
      return newAnims;
    });
  }, [myList, otherList]);

  //使用高阶函数实现我的频道点击事件，useCallback防止回调函数重复创建导致性能下降
  const onMyItemPress = useCallback(
    (item: Category, index: number) => () => {
      if (!edit) {
        return;
      }

      // 动画：淡出+缩小
      Animated.timing(itemAnims[item.name], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        const newMyList = myList.filter(i => i.name !== item.name);
        const copy = { ...item, isAdd: false };
        const newOtherList = [...otherList, copy];
        setMyList(newMyList);
        setOtherList(newOtherList);
        // 重置动画值，方便下次从推荐频道加回来时有动画
        setItemAnims(anims => ({
          ...anims,
          [item.name]: new Animated.Value(1),
        }));
      });
    },
    [myList, otherList, edit, itemAnims],
  );

  const onOtherItemPress = useCallback(
    (item: Category, index: number) => () => {
      if (!edit) {
        return;
      }

      setItemAnims(anims => {
        const newAnim = new Animated.Value(0);
        const newAnims = { ...anims, [item.name]: newAnim };
        Animated.timing(newAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
        return newAnims;
      });

      const newOtherList = otherList.filter(i => i.name !== item.name);
      const copy = { ...item, isAdd: true };
      // console.log('copy', copy);
      const newMyList = [...myList, copy];
      setOtherList(newOtherList);
      setMyList(newMyList);
    },
    [myList, otherList, edit, itemAnims],
  );

  const renderMyList = () => {
    // console.log(myList);
    return (
      <>
        <View style={styles.row}>
          <Text style={styles.titleTxt}>我的频道</Text>
          <Text style={styles.subTitleTxt}>点击进入我的频道</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setEdit((data: boolean) => {
                if (data) {
                  //正在编辑,结束编辑前先缓存数据
                  save(
                    'categoryList',
                    JSON.stringify([...myList, ...otherList]),
                  );
                  return false;
                } else {
                  return true;
                }
              });
            }}
          >
            <Text style={styles.editTxt}>{edit ? '完成编辑' : '进入编辑'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={hide}>
            <Image style={styles.closeImg} source={icon_arrow} />
          </TouchableOpacity>
        </View>
        <View style={styles.listContent}>
          {myList.map((item: Category, index: number) => {
            return (
              <Animated.View
                key={`${item.name}`}
                style={{
                  opacity: itemAnims[item.name] || 1,
                  transform: [
                    {
                      scale: itemAnims[item.name] || 1,
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={
                    item.default
                      ? [styles.itemLayout, styles.itemLayoutDefault]
                      : styles.itemLayout
                  }
                  onPress={() => {
                    if (edit) {
                      onMyItemPress(item, index)();
                    } else {
                      //TODO:点击跳转到对应的频道页面
                    }
                  }}
                >
                  <Text style={styles.itemTxt}>{item.name}</Text>
                  {edit && !item.default && (
                    <Image style={styles.deleteImg} source={icon_delete} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </>
    );
  };

  const renderOtherList = () => {
    return (
      <>
        <View style={[styles.row, styles.otherRow]}>
          <Text style={styles.titleTxt}>推荐频道</Text>
          <Text style={styles.subTitleTxt}>点击添加频道</Text>
        </View>
        <View style={styles.listContent}>
          {otherList.map((item: Category, index: number) => {
            return (
              <TouchableOpacity
                style={styles.itemLayout}
                key={`${item.name}`}
                onPress={onOtherItemPress(item, index)}
              >
                <Text style={styles.itemTxt}>+ {item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      statusBarTranslucent={true} //让状态栏变成透明
      animationType="fade"
      onRequestClose={hide}
    >
      <View style={styles.root}>
        <View style={styles.content}>
          {renderMyList()}
          {renderOtherList()}
        </View>
        <TouchableOpacity style={styles.mask} onPress={hide}>
          <View />
        </TouchableOpacity>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  otherRow: {
    marginTop: 32,
  },
  content: {
    width: '100%',
    backgroundColor: 'white',
    marginTop: 48 + (StatusBar.currentHeight || 0), // 顶部标题栏高度+状态栏高度
    paddingBottom: 40,
  },
  mask: {
    width: '100%',
    flex: 1, // 占满剩余空间
    backgroundColor: '#00000060',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTxt: {
    fontSize: 16,
    color: '#333',
    fontWeight: 500,
    marginLeft: 16,
  },
  subTitleTxt: {
    fontSize: 13,
    color: '#999',
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 10,
    height: 28,
    backgroundColor: '#EEE',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editTxt: {
    fontSize: 13,
    color: '#3050ff',
  },
  closeButton: {
    padding: 12,
  },
  closeImg: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    transform: [{ rotate: '90deg' }],
  },
  listContent: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap', // 自动换行
  },
  itemLayout: {
    width: (SCREEN_WIDTH - 80) >> 2,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    marginLeft: 16,
    marginTop: 12,
  },
  itemLayoutDefault: {
    backgroundColor: '#eee',
  },
  itemTxt: {
    fontSize: 16,
    color: '#666',
  },
  deleteImg: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: -6,
    right: -6,
  },
});
