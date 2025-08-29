import { request } from '../utils/request';
import { flow, observable, action } from 'mobx';
import { save } from '../utils/Storage';
import loading from '../components/widget/Loading';

class UserStore {
  @observable userInfo: any;

  //   requestLogin = async (
  //     phone: string,
  //     pwd: string,
  //     callback: (success: boolean) => void,
  //   ) => {
  //     try {
  //       const params = {
  //         name: phone,
  //         pwd: pwd,
  //       };
  //       const { data } = await request('login', params);
  //       console.log('login response:', data);
  //       if (data) {
  //         this.userInfo = data;
  //         callback?.(true);
  //       } else {
  //         this.userInfo = null;
  //         console.log('登录失败，返回数据为空', data); // 新增日志
  //         callback?.(false);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       this.userInfo = null;
  //       callback?.(false);
  //     }
  //   };

  @action 
  setUserInfo = (info:any) => {
    this.userInfo = info;
  }

  requestLogin = flow(function* (
    this: UserStore,
    phone: string,
    pwd: string,
    callback: (success: boolean) => void,
  ) {
    loading.show();
    try {
      const params = {
        name: phone,
        pwd: pwd,
      };
      const { data } = yield request('login', params); //不再使用await
      console.log('login response:', data);
      if (data) {
        this.userInfo = data;
        save('userInfo', JSON.stringify(data));
        callback?.(true);
      } else {
        this.userInfo = null;
        console.log('登录失败，返回数据为空', data); // 新增日志
        callback?.(false);
      }
    } catch (error) {
      console.log(error);
      this.userInfo = null;
      callback?.(false);
    } finally {
      loading.hide();
    }
  });
}

//ESM单例导出
export default new UserStore();
