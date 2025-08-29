import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import ArticleDetailStore from './ArticleDetailStore';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import icon_arrow from '../../assets/icon_arrow.png';
import icon_share from '../../assets/icon_share.png';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { ImageSlider } from '../../components/slidePager';
import UserStore from '../../stores/UserStore';
import dayjs from 'dayjs';
import Heart from '../../components/Heart';

import icon_collection from '../../assets/icon_collection.png';
import icon_collection_selected from '../../assets/icon_collection_selected.png';
import icon_comment from '../../assets/icon_comment.png';
import icon_comment_selected from '../../assets/icon_comment_selected.png';
import icon_edit from '../../assets/icon_edit_comment.png';
import icon_no_message from '../../assets/icon_no_message.png';

type RouteParams = {
  ArticleDetail: {
    id: number;
  };
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHOW_WIDTH = SCREEN_WIDTH;

export default observer(() => {
  const store = useLocalStore(() => new ArticleDetailStore());
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { params } = useRoute<RouteProp<RouteParams, 'ArticleDetail'>>();
  //console.log('ArticleDetail params:', params);

  const [height, setHeight] = useState<number>(400);

  useEffect(() => {
    store.requestArticleDetail(params.id);
  }, []);

  useEffect(() => {
    if (!store.detail?.images) {
      return;
    }
    const firstImg = store.detail.images[0];
    Image.getSize(firstImg, (width: number, height: number) => {
      const showHeight = (SHOW_WIDTH * height) / width;
      setHeight(showHeight);
    });
  }, [store.detail?.images]);

  const renderTitle = () => {
    const { detail } = store;
    return (
      <View style={styles.titleLayout}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.pop()}
        >
          <Image style={styles.backImg} source={icon_arrow} />
        </TouchableOpacity>
        <Image style={styles.avatarImg} source={{ uri: detail.avatarUrl }} />
        <Text style={styles.userNameTxt}>{detail.userName}</Text>
        <Text style={styles.followTxt}>关注</Text>
        <Image style={styles.shareImg} source={icon_share} />
      </View>
    );
  };

  const renderImg = () => {
    const { detail } = store;
    const { images } = detail;
    if (!images?.length) {
      return null;
    }
    const data: any[] = images.map(i => {
      return { img: i };
    });
    return (
      <View style={{ paddingBottom: 30 }}>
        <ImageSlider
          data={data}
          autoPlay={false}
          closeIconColor="white"
          caroselImageStyle={{ height }}
          indicatorContainerStyle={{ bottom: -40 }}
          activeIndicatorStyle={styles.activeDot}
          inActiveIndicatorStyle={styles.inActiveDot}
        />
      </View>
    );
  };

  const renderInfo = () => {
    const { detail } = store;
    const tags = detail.tag?.map(i => `# ${i}`).join(' ');
    return (
      <View style={styles.infoLayout}>
        <Text style={styles.articleTitleTxt}>{detail.title}</Text>
        {!!detail.desc && <Text style={styles.descTxt}>{detail.desc}</Text>}
        {!!tags && <Text style={styles.tagsTxt}>{tags}</Text>}
        <Text style={styles.timeAndLocationTxt}>
          编辑于 {detail.dateTime} {detail.location}
        </Text>
        <View style={styles.line} />
      </View>
    );
  };

  const renderComment = () => {
    const { detail } = store;
    const count = detail.comments?.length || 0;
    const { userInfo } = UserStore;
    //console.log(userInfo);

    return (
      <>
        <Text style={styles.commentsCountTxt}>
          {count ? `共${count}条评论` : '暂无评论'}
        </Text>
        <View style={styles.inputLayout}>
          <Image style={styles.AvatarImg} source={{ uri: userInfo.avatar }} />
          <TextInput
            style={styles.commentInput}
            placeholder="留下你的想法吧"
            placeholderTextColor={'#bbb'}
          />
        </View>

        {count ? (
          <View style={styles.commentsContainer}>
            {detail.comments?.map((i: ArticleComment, index: number) => {
              return (
                <View key={`${index}`} style={styles.commentRoot}>
                  <View style={styles.commentItem}>
                    <Image
                      style={styles.AvatarImg}
                      source={{ uri: i.avatarUrl }}
                    />
                    <View style={styles.contentLayout}>
                      <Text style={styles.nameTxt}>{i.userName}</Text>
                      <Text style={styles.messageTxt}>
                        {i.message}
                        <Text style={styles.timeAndLocationTxt}>
                          {' '}
                          {dayjs(i.dateTime).format('MM-DD')} {i.location}
                        </Text>
                      </Text>
                      {/**嵌套评论 */}
                      {!!i.children?.length &&
                        i.children.map(
                          (j: ArticleComment, subIndex: number) => {
                            return (
                              <View
                                key={`${subIndex}`}
                                style={[
                                  styles.commentItem,
                                  {
                                    marginVertical: 12,
                                    width: SCREEN_WIDTH - 80,
                                  },
                                ]}
                              >
                                <Image
                                  style={styles.AvatarImg}
                                  source={{ uri: j.avatarUrl }}
                                />
                                <View style={styles.contentLayout}>
                                  <Text style={styles.nameTxt}>
                                    {j.userName}
                                  </Text>
                                  <Text style={styles.messageTxt}>
                                    {j.message}
                                    <Text style={styles.timeAndLocationTxt}>
                                      {' '}
                                      {dayjs(j.dateTime).format('MM-DD')}{' '}
                                      {j.location}
                                    </Text>
                                  </Text>
                                </View>
                                <View style={styles.countLayout}>
                                  <Heart value={j.isFavorite} size={20} />
                                  <Text style={styles.countTxt}>
                                    {j.favoriteCount}
                                  </Text>
                                </View>
                              </View>
                            );
                          },
                        )}
                    </View>
                    <View style={styles.countLayout}>
                      <Heart value={i.isFavorite} size={20} />
                      <Text style={styles.countTxt}>{i.favoriteCount}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                </View>
              );
            })}
            <Text style={styles.commentBottomTxt}>-到底了-</Text>
          </View>
        ) : (
          <View style={styles.nonCommentLayout}>
            <Image style={styles.noCommentImg} source={icon_no_message} />
            <View style={styles.nonCommentTxtLayout}>
              <Text style={styles.nonCommentTxt}>这是一片荒芜地,</Text>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareTxt}>分享笔记</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  };

  const renderBottom = () => {
    const { detail } = store;
    return (
      <View style={styles.bottomLayout}>
        <View style={styles.bottomEditLayout}>
          <Image style={styles.iconEdit} source={icon_edit} />
          <TextInput
            style={styles.BottomCommentInput}
            placeholder="说点什么..."
            placeholderTextColor={'#bbb'}
          />
        </View>
        <Heart value={detail.isFavorite} size={28} />
        <Text style={styles.bottomCount}>{detail.favoriteCount}</Text>
        <Image style={styles.bottomIcon} source={icon_collection} />
        <Text style={styles.bottomCount}>{detail.collectionCount}</Text>
        <Image style={styles.bottomIcon} source={icon_comment} />
        <Text style={styles.bottomCount}>{detail.comments?.length}</Text>
      </View>
    );
  };

  return store.detail ? (
    <View style={styles.root}>
      {renderTitle()}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderImg()}
        {renderInfo()}
        {renderComment()}
      </ScrollView>
      {renderBottom()}
    </View>
  ) : null;
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  titleLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    width: '100%',
    paddingHorizontal: 16,
  },
  backButton: {
    paddingRight: 8,
    height: '100%',
    justifyContent: 'center',
  },
  backImg: {
    width: 20,
    height: 20,
  },
  avatarImg: {
    width: 36,
    height: 36,
    resizeMode: 'cover',
    borderRadius: 18,
  },
  userNameTxt: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  followTxt: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff2442',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    color: '#ff2442',
  },
  shareImg: {
    width: 28,
    height: 28,
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  activeDot: {
    width: 6,
    height: 6,
    backgroundColor: '#ff2442',
    borderRadius: 3,
  },
  inActiveDot: {
    width: 6,
    height: 6,
    backgroundColor: '#c0c0c0',
    borderRadius: 3,
  },
  infoLayout: {
    paddingHorizontal: 16,
  },
  articleTitleTxt: {
    fontSize: 18,
    color: '#333',
    fontWeight: '400',
    marginTop: 12,
  },
  descTxt: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  tagsTxt: {
    fontSize: 16,
    color: '#499ed6',
    marginTop: 8,
  },
  timeAndLocationTxt: {
    fontSize: 12,
    color: '#c0c0c0',
    marginTop: 20,
    marginBottom: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
  },
  commentRoot: {
    paddingRight:8,
  },
  commentsCountTxt: {
    marginTop: 20,
    fontSize: 15,
    color: '#666',
    marginLeft: 16,
  },
  inputLayout: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  AvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'cover',
    marginRight: 16,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0, //安卓需要设置paddingVertical为0才能垂直居中
  },
  commentsContainer: {
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  commentItem: {
    width: '100%', //不写高度，也不加垂直对齐
    flexDirection: 'row',
  },
  contentLayout: {
    flexDirection: 'column',
    flex: 1,
    //justifyContent:'center',
  },
  nameTxt: {
    fontSize: 14,
    color: '#bbb',
  },
  messageTxt: {
    fontSize: 16,
    color: '#333',
    marginTop: 6,
  },
  countLayout: {
    alignItems: 'center',
  },
  countTxt: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  commentBottomTxt:{
    marginTop:30,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  divider: {
    marginLeft: 50,
    marginRight: 0,
    marginVertical: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
  },
  bottomLayout: {
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomEditLayout: {
    height: 36,
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEdit: {
    width: 20,
    height: 20,
    marginLeft: 12,
    color: '#',
  },
  BottomCommentInput: {
    height: '100%',
    color: '#333',
    flex: 1,
    textAlignVertical: 'center',
    fontSize: 16,
    paddingVertical: 0, ////安卓需要设置paddingVertical为0才能垂直居中
  },
  bottomCount: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '400',
    textAlignVertical: 'center',
  },
  bottomIcon: {
    width: 28,
    height: 28,
    marginLeft: 16,
  },
  nonCommentLayout: {
    height: SCREEN_HEIGHT - StatusBar.currentHeight! - 56 - 40 - 64,
    alignItems: 'center',
  },
  noCommentImg:{
    width:80,
    height:80,
    marginTop:80,
    resizeMode:'contain',
  },
  nonCommentTxtLayout:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:16,
  },
  nonCommentTxt: {
    fontSize: 12,
    color:'#999',
  },
  shareButton: {
    marginLeft:8,
  },
  shareTxt: {
    fontSize: 13,
    color: '#499ed6',
  },
});
