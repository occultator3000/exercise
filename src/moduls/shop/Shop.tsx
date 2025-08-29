import React, { useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import ShopStore from './ShopStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import icon_search from '../../assets/icon_search.png';
import icon_shop_car from '../../assets/icon_shop_car.png';
import icon_orders from '../../assets/icon_orders.png';
import icon_menu_more from '../../assets/icon_menu_more.png';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - 18) >> 1;
export default observer(() => {
  const store = useLocalStore(() => new ShopStore());
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    store.requestGoodsList();
    store.requestTop10Category();
  }, []);

  const onSearchPress = () => {
    navigation.push('SearchGoods');
  };

  const renderTitle = () => {
    return (
      <View style={styles.titleLayout}>
        <TouchableOpacity style={styles.searchLayout} onPress={onSearchPress}>
          <Image style={styles.searchIcon} source={icon_search} />
          <Text style={styles.searchTxt}>口红</Text>
        </TouchableOpacity>
        <Image style={styles.menuIcon} source={icon_shop_car} />
        <Image style={styles.menuIcon} source={icon_orders} />
        <Image style={styles.menuIcon} source={icon_menu_more} />
      </View>
    );
  };

  const ListHeader = () => {
    const { categoryList } = store;
    const styles = StyleSheet.create({
      container: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      categoryItem: {
        width: '20%',
        alignItems: 'center',
        paddingVertical: 16,
      },
      itemImg: {
        width: 40,
        height: 48,
        resizeMode: 'contain',
      },
      itemNameTxt: {
        fontSize: 14,
        color: '#333',
        marginTop: 6,
      },
    });
    return (
      <View style={styles.container}>
        {categoryList.map((item, index) => {
          return (
            <View key={item.id} style={styles.categoryItem}>
              <Image style={styles.itemImg} source={{ uri: item.image }} />
              <Text style={styles.itemNameTxt}>{item.name}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: GoodsSimple;
    index: number;
  }) => {
    const styles = StyleSheet.create({
      item: {
        width: ITEM_WIDTH,
        borderRadius: 8,
        overflow: 'hidden', // 超出部分隐藏
        backgroundColor: '#green',
        marginLeft: 6,
        marginTop: 6,
      },
      img: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
      },
      titleTxt: {
        fontSize: 14,
        color: '#333',
        marginTop: 6,
      },
      prefix: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
      },
      priceTxt: {
        fontSize: 22,
        color: '#333',
        fontWeight: '500',
        textAlign: 'justify',
      },
      originTxt: {
        fontSize: 14,
        color: '#999',
        fontWeight: 'normal',
      },
      promotionTxt: {
        width: 78,
        fontSize: 12,
        color: '#999',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#bbb',
        textAlign: 'center',
      },
    });
    return (
      <View style={styles.item}>
        <Image style={styles.img} source={{ uri: item.image }} />
        <Text style={styles.titleTxt}>{item.title}</Text>
        {!!item.promotion && (
          <Text style={styles.promotionTxt}>{item.promotion}</Text>
        )}
        <Text style={styles.prefix}>
          ¥
          <Text style={styles.priceTxt}>
            {item.price}
            {!!item.originPrice && (
              <Text style={styles.originTxt}> 原价:{item.originPrice}</Text>
            )}
          </Text>
        </Text>
      </View>
    );
  };

  const refreshNewData = () => {
    store.resetPage();
    store.requestGoodsList();
  };

  const loadMoreData = () => {
    store.requestGoodsList();
  };

  const Footer = () => {
      return <Text style={styles.footerTxt}>没有更多商品了</Text>;
    };

  return (
    <View style={styles.root}>
      {renderTitle()}
      <FlatList
        style={{ flex: 1, backgroundColor: 'white' }}
        data={store.goodsList}
        keyExtractor={(item) => item.id.toString()}
        extraData={[store.categoryList, store.refreshing]}
        renderItem={renderItem}
        numColumns={2}
        refreshing={store.refreshing}
        onRefresh={refreshNewData}
        onEndReachedThreshold={0.2} //距离底部还有20%时触发
        onEndReached={loadMoreData}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false} // 垂直列表隐藏滚动条
        ListFooterComponent={<Footer />}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
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
  searchLayout: {
    height: 32,
    flex: 1,
    backgroundColor: '#ddd',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  searchTxt: {
    fontSize: 16,
    color: '#bbb',
    marginLeft: 6,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginLeft: 16,
  },
  footerTxt: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginVertical: 16,
    textAlignVertical: 'center',
  },
});
