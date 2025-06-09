import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import vueHook from 'alova/vue';
import { createApis, withConfigType } from './createApis';

export const alovaInstance = createAlova({
  baseURL: '//visitors.qxyjm.com',
  statesHook: vueHook,
  requestAdapter: fetchAdapter(),
  beforeRequest: method => {},
  responded: res => {
    return res.json();
  }
});

export const $$userConfigMap = withConfigType({});

/**
 * @type { Apis }
 */
const Apis = createApis(alovaInstance, $$userConfigMap);

export default Apis;
