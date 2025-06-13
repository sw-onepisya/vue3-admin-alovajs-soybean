import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
// TODO: 替换登录和获取用户的 API 为自己的 API
import to from 'await-to-js';
import { fetchGetUserInfo, fetchLogin } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';
import Apis from '@/service-alova/api-auto';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { useThemeStore } from '../theme';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();
  const { setWatermarkText } = useThemeStore();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive({
    userId: '',
    userName: '',
    roles: [],
    buttons: []
  });

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    recordUserId();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
    setWatermarkText('清翔越访客管理系统');
  }

  /** Record the user ID of the previous login session Used to compare with the current user ID on next login */
  function recordUserId() {
    if (!userInfo.userId) {
      return;
    }

    // Store current user ID locally for next login comparison
    localStg.set('lastLoginUserId', userInfo.userId);
  }

  /**
   * Check if current login user is different from previous login user If different, clear all tabs
   *
   * @returns {boolean} Whether to clear all tabs
   */
  function checkTabClear(): boolean {
    if (!userInfo.userId) {
      return false;
    }

    const lastLoginUserId = localStg.get('lastLoginUserId');

    // Clear all tabs if current user is different from previous user
    if (!lastLoginUserId || lastLoginUserId !== userInfo.userId) {
      localStg.remove('globalTabs');
      tabStore.clearTabs();

      localStg.remove('lastLoginUserId');
      return true;
    }

    localStg.remove('lastLoginUserId');
    return false;
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    // TODO: 30 替换 login 逻辑
    // startLoading();

    // const { data: loginToken, error } = await fetchLogin(userName, password);

    // if (!error) {
    //   const pass = await loginByToken(loginToken);

    //   if (pass) {
    //     // Check if the tab needs to be cleared
    //     const isClear = checkTabClear();
    //     let needRedirect = redirect;

    //     if (isClear) {
    //       // If the tab needs to be cleared,it means we don't need to redirect.
    //       needRedirect = false;
    //     }
    //     await redirectFromLogin(needRedirect);

    //     window.$notification?.success({
    //       title: $t('page.login.common.loginSuccess'),
    //       content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
    //       duration: 4500
    //     });
    //   }
    // } else {
    //   resetStore();
    // }

    // endLoading();

    startLoading();

    const [error, loginToken] = await to(
      Apis.general.pcLoginUsingPOST({
        data: {
          username: userName,
          password
        }
      })
    );

    if (!error) {
      console.log("loginToken", loginToken)
      // 由于我的后端不使用  Token 而是使用 HttpOnly 的 cookie 基于 Session
      // 所以这里都无所谓的 但是在我们的 isLogin 是通过 token localStorage 中的 token 来判断的、
      // 所以我们可以随便设置一个、如果 401 了会自动跳转到 login 页面
      // 所以其实我们也可以、直接让后端把 cookie 通过 data 返回过来。
      const pass = await loginByToken({
        // token: loginToken as string,
        token: loginToken,
        refreshToken: ''
      } as any);

      if (pass) {
        // Check if the tab needs to be cleared
        const isClear = checkTabClear();
        let needRedirect = redirect;

        if (isClear) {
          // If the tab needs to be cleared,it means we don't need to redirect.
          needRedirect = false;
        }
        await redirectFromLogin(needRedirect);

        window.$notification?.success({
          title: $t('page.login.common.loginSuccess'),
          content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
          duration: 4500
        });
      }
    }
    // INFO: 无需在这里面处理错误、因为在 alova.js 的 onError 中已经处理了

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.token);
    localStg.set('refreshToken', loginToken.refreshToken);

    // 2. get user info
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.token;

      return true;
    }

    return false;
  }

  async function getUserInfo() {
    // const { data: info, error } = await fetchGetUserInfo();

    // if (!error) {
    //   // update store
    //   Object.assign(userInfo, info);

    //   return true;
    // }

    // return false;

    // INFO: 硬编码用户信息
    // INFO-onepisya : 以后如果有需要再、修改为接口获取、现在是后端没有接口所以先硬编码
    const info = {
      userId: '0',
      userName: 'Admin',
      roles: ['R_SUPER'],
      buttons: ['B_CODE1', 'B_CODE2', 'B_CODE3']
    };

    Object.assign(userInfo, info);
    // 设置新的水印文字
    setWatermarkText(userInfo.userName);

    return true;
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo
  };
});
