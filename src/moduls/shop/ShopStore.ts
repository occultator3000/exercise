import { request } from '../../utils/request';
import { observable, action } from 'mobx';
import {load}from '../../utils/Storage';

const SIZE = 10;
export default class GoodsStore {
  page: number = 1;

  @observable goodsList: GoodsSimple[] = [];

  @observable refreshing: boolean = false;

  @observable categoryList: GoodsCategory[] = [];

  //重置分页页码
  @action
  resetPage = () => {
    this.page = 1;
  };

  requestGoodsList = async () => {
    if (this.refreshing) {
      return;
    }
    try {
      this.refreshing = true; //开始刷新
      const params = {
        page: this.page,
        size: SIZE,
      };
      const { data } = await request('goodsList', params);
      console.log(`data=${JSON.stringify(data)}`);
      if (data?.length) {
        if (this.page === 1) {
          this.goodsList = data;
        } else {
          this.goodsList = [...this.goodsList, ...data];
        }
        this.page += 1;
      } else {
        if (this.page === 1) {
          this.goodsList = [];
        } else {
          //没有更多数据了
        }
      }
    } catch (error) {
      console.log('请求失败', error);
    } finally {
      this.refreshing = false; //结束刷新
    }
  };

  requestTop10Category = async () => {
    const params={};
    try {
      const {data}=await request('top10Category',params);
      this.categoryList=data;
    } catch (error) {
      console.log('请求失败', error);
    } 
  };
}
