import axios,{AxiosResponse} from 'axios';
import Apis from '../api/Apis';

const instance = axios.create({
  //baseURL: 'http://10.0.231.134:7001',
  baseURL:'http://192.168.1.100:7001',
  timeout: 10000,
});

/**
 * 对返回体错误信息分类
 */
instance.interceptors.response.use(
    response => response,
    error =>{
        const {response} =error;
        if(!response){
            const {status} = response;
            if(status >= 500){
                // 服务器错误
                console.error('服务器错误，请稍后再试');
            }else if (status ===400){
                //接口参数异常
                console.error('请求参数异常，请检查');
            }else if(status === 401){
                //登录信息过期，需要重新登录
                console.error('登录信息过期，请重新登录');
            }else {
                //其他错误类型，统一按照接口报错处理
                console.error('其他错误，请稍后再试');
            }
        }else {
            //网络异常
            console.error('网络异常，请检查网络连接');
        }
        return Promise.reject(error);
    }
);

export const request = (name: string, params: any):Promise<AxiosResponse<any, any>> => {
  const api = (Apis as any)[name];
  const { url, method } = api;
  if (method === 'get') {
    return get(url, params);
  } else {
    return post(url, params);
  }
};

const get = (url: string, params: any):Promise<AxiosResponse<any, any>> => {
  return instance.get(url, {
    params: params,
  });
};

const post = (url: string, params: any):Promise<AxiosResponse<any, any>> => {
  return instance.post(url, params);
};

//export { get, post };
