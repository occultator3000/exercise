import React, { useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import MessageStore from './MessageStore';
import FloatMenu, { FloatMenuRef } from './FloatMenu';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import icon_group from '../../assets/icon_group.png';
import icon_star from '../../assets/icon_star.png';
import icon_new_follow from '../../assets/icon_new_follow.png';
import icon_comments from '../../assets/icon_comments.png';
import icon_to_top from '../../assets/icon_to_top.png';
import icon_arrow from '../../assets/icon_arrow.png';

export default observer(() => {
  const store = useLocalStore(() => new MessageStore());
  const ref = useRef<FloatMenuRef>(null);

  useEffect(() => {
    store.requestMessageList();
    store.requestUnRead();
  }, []);

  const renderTitle = () => {
    return (
      <View style={styles.titleLayout}>
        <Text style={styles.titleTxt}>消息</Text>
        <TouchableOpacity
          style={styles.groupButton}
          onPress={(event: GestureResponderEvent) => {
            const { pageY } = event.nativeEvent;
            ref.current?.show(pageY+60);
          }}
        >
          <Image style={styles.iconGroup} source={icon_group} />
          <Text style={styles.groupTxt}>群聊</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Unread = ({ count }: { count: number }) => {
    const styles = StyleSheet.create({
      txt: {
        position: 'absolute',
        top: 0,
        right: -6,
        backgroundColor: '#ff2442',
        paddingHorizontal: 10,
        height: 20,
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 12,
      },
    });
    return <Text style={styles.txt}>{count > 99 ? '99+' : count}</Text>;
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: MessageListItem;
    index: number;
  }) => {
    const styles = StyleSheet.create({
      item: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
      },
      avatarImg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        resizeMode: 'cover',
      },
      contentLayout: {
        flex: 1,
        marginHorizontal: 12,
      },
      nameTxt: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
      },
      lastMessageTxt: {
        fontSize: 15,
        color: '#999',
        marginTop: 4,
      },
      rightLayout: {
        alignItems: 'flex-end',
      },
      timeTxt: {
        fontSize: 12,
        color: '#999',
      },
      iconTop: {
        width: 8,
        height: 16,
        marginTop: 6,
        resizeMode: 'contain',
      },
    });

    return (
      <View style={styles.item}>
        <Image style={styles.avatarImg} source={{ uri: item.avatarUrl }} />
        <View style={styles.contentLayout}>
          <Text style={styles.nameTxt}>{item.name}</Text>
          <Text style={styles.lastMessageTxt} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <View style={styles.rightLayout}>
          <Text style={styles.timeTxt}>{item.lastMessageTime}</Text>
          <Image style={styles.iconTop} source={icon_to_top} />
        </View>
      </View>
    );
  };

  const Header = () => {
    const { unread } = store;
    return (
      <View style={styles.headerLayout}>
        <View style={styles.headerItem}>
          <View>
            <Image source={icon_star} style={styles.itemImg} />
            {unread?.unreadFavorite && <Unread count={unread.unreadFavorite} />}
          </View>
          <Text style={styles.itemTxt}>赞和收藏</Text>
        </View>
        <View style={styles.headerItem}>
          <View>
            <Image source={icon_new_follow} style={styles.itemImg} />
            {unread?.newFollow && <Unread count={unread.newFollow} />}
          </View>
          <Text style={styles.itemTxt}>新增关注</Text>
        </View>
        <View style={styles.headerItem}>
          <View>
            <Image source={icon_comments} style={styles.itemImg} />
            {unread?.comment && <Unread count={unread.comment} />}
          </View>
          <Text style={styles.itemTxt}>评论和@</Text>
        </View>
      </View>
    );
  };

  const refreshNewData = () => {
    store.resetPage();
    store.requestMessageList();
  };

  const loadMoreData = () => {
    store.requestMessageList();
  };

  const Footer = () => {
    const styles = StyleSheet.create({
      footerLayout: {
        width: '100%',
        marginVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      footerTxt: {
        textAlign: 'center',
        fontSize: 14,
        color: '#999',
        textAlignVertical: 'center',
      },
      iconImg: {
        width: 16,
        height: 16,
        marginLeft: 6,
        resizeMode: 'contain',
        tintColor: '#999',
        transform: [{ rotate: '180deg' }],
      },
    });
    return (
      <TouchableOpacity style={styles.footerLayout} activeOpacity={0.7}>
        <Text style={styles.footerTxt}>发现更多感兴趣的人</Text>
        <Image style={styles.iconImg} source={icon_arrow} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {renderTitle()}
      <FlatList
        style={{ flex: 1 }}
        data={store.messageList}
        keyExtractor={item => item.id.toString()}
        extraData={[store.unread, store.refreshing]}
        refreshing={store.refreshing}
        onRefresh={refreshNewData}
        onEndReachedThreshold={0.2} //距离底部还有20%时触发
        onEndReached={loadMoreData}
        renderItem={renderItem}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
      />
      <FloatMenu ref={ref} />
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
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupButton: {
    flexDirection: 'row',
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    height:'100%',//高度撑满才好计算高度
  },
  titleTxt: {
    fontSize: 18,
    color: '#333',
  },
  iconGroup: {
    width: 16,
    height: 16,
  },
  groupTxt: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  headerLayout: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  headerItem: {
    flex: 1,
    alignItems: 'center',
  },
  itemImg: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginTop: 10,
  },
  itemTxt: {
    fontSize: 16,
    color: '#333',
    marginTop: 14,
  },
});
