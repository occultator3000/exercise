/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
  //useSafeAreaInsets,
} from 'react-native-safe-area-context';
//import Router from './src/router';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import Welcome from './src/moduls/welcome/Welcome';
import Login from './src/moduls/login/Login';
import MainTab from './src/moduls/mainTab/MainTab';
import ArticleDetail from './src/moduls/articleDetail/ArticleDetail';
import SearchGoods from './src/moduls/searchGoods/SearchGoods';

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            cardStyle: { elevation: 1 },
          }}
        >
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              title: '闪屏页',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: '登录页',
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="MainTab"
            component={MainTab}
            options={{
              title: '首页',
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="ArticleDetail"
            component={ArticleDetail}
            options={{
              title: '文章详情',
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name="SearchGoods"
            component={SearchGoods}
            options={{
              title: '搜索商品',
              headerShown: false,
              presentation:'transparentModal', //实现无缝切换页面
              animation: 'fade',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
