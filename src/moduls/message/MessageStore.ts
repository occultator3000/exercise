import { request } from '../../utils/request';
import { observable, action, flow } from 'mobx';
import {load}from '../../utils/Storage';

const SIZE = 10;
export default class MessageStore {
  page: number = 1;

  @observable messageList: MessageListItem[] = [];

  @observable refreshing: boolean = false;

  @observable unread: Unread = {} as Unread;

  //重置分页页码
  @action
  resetPage = () => {
    this.page = 1;
  };

  requestMessageList = async () => {
    if (this.refreshing) {
      return;
    }
    try {
      this.refreshing = true; //开始刷新
      const params = {
        page: this.page,
        size: SIZE,
      };
      const { data } = await request('messageList', params);
      console.log(`messageData=${JSON.stringify(data)}`);
      if (data?.length) {
        if (this.page === 1) {
          this.messageList = data;
        } else {
          this.messageList = [...this.messageList, ...data];
        }
        this.page += 1;
      } else {
        if (this.page === 1) {
          this.messageList = [];
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
  requestUnRead = flow (function*(this:MessageStore) {
    const params={};
    try {
      const {data}=yield request('unread',params);
      this.unread=data || {};
    } catch (error) {
      console.log('请求失败', error);
    } 
  });

}

