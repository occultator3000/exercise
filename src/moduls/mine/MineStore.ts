import { request } from '../../utils/request';
import { observable, action, flow } from 'mobx';
import {load}from '../../utils/Storage';
import Loading from '../../components/widget/Loading';

const SIZE = 10;
export default class MineStore {
  @observable refreshing: boolean = false;

  @observable info: any = {};
  @observable noteList: ArticleSimple [] = [];
  @observable collectionList: ArticleSimple [] = [];
  @observable favoriteList: ArticleSimple [] = [];

  requestAll = async () => {
    Loading.show();
    this.refreshing=true;
    Promise.all([
      this.requestInfo(),
      this.requestNodeList(),
      this.requestCollectionList(),
      this.requestFavoriteList(),
    ]).then(()=>{
      Loading.hide();
      this.refreshing=false;
    })
  }
  
  requestInfo = async () => {
    try {
      const params = {
      };
      const { data } = await request('accountInfo', params);
      console.log('info', data);
      this.info = data || {};
      }catch (error) {
      console.log('请求失败', error);
    } 
  };

  requestNodeList = async () => {
    try {
      const params = {
      };
      const { data } = await request('noteList', params);
      console.log('noteList', data);
      this.noteList = data || {};
      }catch (error) {
      console.log('请求失败', error);
    } 
  };

  requestCollectionList = async () => {
    try {
      const params = {
      };
      const { data } = await request('collectionList', params);
      console.log('collectionList', data);
      this.collectionList = data || {};
      }catch (error) {
      console.log('请求失败', error);
    } 
  };

  requestFavoriteList = async () => {
    try {
      const params = {
      };
      const { data } = await request('favoriteList', params);
      console.log('favoriteList', data);
      this.favoriteList = data || {};
      }catch (error) {
      console.log('请求失败', error);
    } 
  };
}

