import { request } from '../../utils/request';
import { observable } from 'mobx';
import {load}from '../../utils/Storage';
import Loading from '../../components/widget/Loading';

export default class ArticleDetailStore {

  @observable detail:Article = {} as Article;

  requestArticleDetail = async (id: number | string) => {
    Loading.show();
    try {
      const params = {
        id: id,
      };
      const { data } = await request('articleDetail', params);
      //console.log('articleDetail response:', data);
      this.detail = data || {};
    } catch (error) {
      console.log('请求失败', error);
    } finally {
      Loading.hide();
    }
  };
}
