import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import HomeStore from './HomeStore';
import { observer, useLocalStore } from 'mobx-react';
import FlowList from '../../components/flowlists/FlowList.js';
import ResizeImage from '../../components/ResizeImage';
import Heart from '../../components/Heart';
import TitleBar from './components/TitleBar';
import CategoryList from './components/CategoryList';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUpdate } from 'react-native-update';
import {save} from '../../utils/Storage';

import _updateConfig from '../../../update.json';
const { appKey } = _updateConfig.android;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default observer(() => {
  const store = useLocalStore(() => new HomeStore());

  const navigation = useNavigation<StackNavigationProp<any>>();

  const [tab, setTab] = useState<number>(1);

  const {
    checkUpdate,
    downloadUpdate,
    switchVersionLater,
    switchVersion,
  } = useUpdate();

  useEffect(() => {
    store.requestHomeList();
    store.getCategoryList();

    checkPatch();
  }, []);

  // 检查补丁更新
  const checkPatch = async () => {
    const info: any = await checkUpdate();
    const { update, name, description, metaInfo } = info;
    const metaJson = JSON.parse(metaInfo);
    save('patchVersion', name);
    const { forceUpdate } = metaJson;
    if (forceUpdate) {
      // 弹窗提示用户
    } else {
      // 不弹窗默默操作
    }
    if (update) {
      const hash = await downloadUpdate();
      if (hash) {
        if (forceUpdate) {
          switchVersion();
        } else {
          switchVersionLater();
        }
      }
    }
  };

  const onArticlePress = useCallback(
    (article: ArticleSimple) => () => {
      navigation.push('ArticleDetail', { id: article.id }); //使用push跳转文章详情
    },
    [],
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: ArticleSimple;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.9}
        onPress={onArticlePress(item)}
      >
        {/* <Image style={styles.itemImage} source={{ uri: item.image }} /> */}
        <ResizeImage uri={item.image} />
        <Text style={styles.titleTxt}>{item.title}</Text>
        <View style={styles.nameLayout}>
          <Image style={styles.avatarImg} source={{ uri: item.avatarUrl }} />
          <Text style={styles.nameTxt}>{item.userName}</Text>
          {/* <Image style={styles.heart} source={icon_heart_empty} /> */}
          <Heart
            value={item.isFavorite}
            onValueChanged={(value: boolean) => {
              console.log('点击了爱心', value);
            }}
          />
          <Text style={styles.heartTxt}>{item.favoriteCount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const refreshNewData = () => {
    store.resetPage();
    store.requestHomeList();
  };

  const loadMoreData = () => {
    store.requestHomeList();
  };

  const Footer = () => {
    return <Text style={styles.footerTxt}>没有更多数据了</Text>;
  };

  const categoryList = store.categoryList.filter(i => i.isAdd);

  return (
    <View style={styles.root}>
      <TitleBar
        tab={1}
        onTabChanged={(tab: number) => {
          setTab(tab);
          console.log(`tab=${tab}`);
        }}
      />
      <FlowList
        style={styles.flatList}
        data={store.homeList}
        keyExtractor={(item: ArticleSimple) => `${item.id}`}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        numColumns={2}
        extraData={store.refreshing}
        refreshing={store.refreshing}
        onRefresh={refreshNewData}
        onEndReachedThreshold={0.2} //距离底部还有20%时触发
        onEndReached={loadMoreData}
        ListFooterComponent={<Footer />}
        ListHeaderComponent={
          tab === 1 ? (
            <CategoryList
              categoryList={categoryList}
              allCategoryList={store.categoryList}
              onCategoryChange={(category: Category) => {
                console.log('选择了分类', JSON.stringify(category));
              }}
            />
          ) : (
            <View style={styles.header} />
          )
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
  flatList: {
    width: '100%',
    height: '100%',
  },
  container: {
    paddingTop: 1,
  },
  item: {
    width: (SCREEN_WIDTH - 18) >> 1,
    //height: 260,
    backgroundColor: 'white',
    marginLeft: 6,
    marginBottom: 6,
    borderRadius: 8,
  },
  itemImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover', //填满
  },
  titleTxt: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 10,
    marginVertical: 4,
  },
  nameLayout: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  avatarImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  nameTxt: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
    flex: 1, //占满剩余，把爱心顶到右边
  },
  heartTxt: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  footerTxt: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    color: 'red',
    marginVertical: 16,
    textAlignVertical: 'center',
  },
  header: {
    width: '100%',
    height: 6,
  },
});
