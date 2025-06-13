import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import vueHook from 'alova/vue';
import { alova } from '@/service-alova/request';
import { createApis, withConfigType } from './createApis';

export const alovaInstance = alova;

// createAlova({
//   baseURL: '//visitors.qxyjm.com',
//   statesHook: vueHook,
//   requestAdapter: fetchAdapter(),
//   beforeRequest: method => {},
//   responded: res => {
//     return res.json();
//   }
// });

export const $$userConfigMap = withConfigType({
  'general.queryPageUsingGET': {
    name: 'queryPageUsingGET',
    cacheFor: 15 * 1000
  },
  'general.exportAllVisitorDataUsingGET': {
    name: 'exportAllVisitorDataUsingGET',
    cacheFor: 15 * 1000,
    meta: {
      isDownload: true
    }
  },
  'general.exportVisitorPageDataUsingGET': {
    name: 'exportVisitorPageDataUsingGET',
    cacheFor: 15 * 1000,
    meta: {
      isDownload: true
    }
  }
});

const Apis = createApis(alovaInstance, $$userConfigMap);

export default Apis;
