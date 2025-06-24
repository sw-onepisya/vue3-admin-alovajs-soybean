import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import vueHook from 'alova/vue';
import { alova } from '@/service-alova/request';
import { createApis, withConfigType } from './createApis';
import apiDefinitions from './apiDefinitions';

// 定义 API 定义的类型
type DefaultHttpMethod =  'GET' | 'POST' | 'PUT' | 'DELETE' 
| 'HEAD' | 'OPTIONS' | 'PATCH';
type CustomHttpMethod = string & {};
type HttpMethod = DefaultHttpMethod | CustomHttpMethod;
type ApiDefinition = [HttpMethod, string];
type ApiDefinitions = Record<keyof typeof apiDefinitions, ApiDefinition>;


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

// 批量生成默认配置的函数
function createDefaultConfigType(apiDefinitions: ApiDefinitions) {
  const apiKeys = Object.keys(apiDefinitions) as (keyof ApiDefinitions)[];
  const defaultCacheFor = 15 * 1000;
  const batchConfigTypes: Record<string, any> = {};

  apiKeys.forEach(key => {
    const [methodType] = apiDefinitions[key];
    const [name] = key.split('.');
    batchConfigTypes[key] = {
      name, // 使用方法名作为 name
      cacheFor: methodType === 'GET' ? defaultCacheFor : 0,
      meta: {},
      credentials: 'include',
      referrerPolicy: 'no-referrer',
      mode: 'cors'
    };
  });

  return batchConfigTypes;
}

// 默认配置
const defaultConfigTypes = createDefaultConfigType(apiDefinitions as ApiDefinitions);

// 自定义配置（覆盖默认配置）
// any 这里可以定义更详细的类型、比如导出 alova 的类型放进去、当然其实这样也够了
// 比如 AlovaAxiosRequestConfig 导出 alova 的类型
const customConfigTypes: Partial<Record<keyof typeof apiDefinitions, any>> = {
  'general.exportAllVisitorDataUsingGET': {
    meta: {
      isDownload: true
    },
  },
  'general.exportVisitorPageDataUsingGET': {
    meta: {
      isDownload: true
    },
  }
};

// 合并配置的工具函数
function mergeConfigs(defaultConfig: Record<string, any>, customConfig: Record<string, any>) {
  const mergedConfig: Record<string, any> = {};

  // 先添加所有默认配置
  Object.keys(defaultConfig).forEach(key => {
    mergedConfig[key] = { ...defaultConfig[key] };
  });

  // 然后用自定义配置覆盖
  Object.keys(customConfig).forEach(key => {
    if (mergedConfig[key]) {
      // 深度合并
      mergedConfig[key] = {
        ...mergedConfig[key],
        ...customConfig[key],
        meta: {
          ...mergedConfig[key].meta,
          ...customConfig[key].meta
        }
      };
    } else {
      mergedConfig[key] = { ...customConfig[key] };
    }
  });

  return mergedConfig;
}

// 生成最终的配置
const finalConfig = mergeConfigs(defaultConfigTypes, customConfigTypes);

// 导出配置映射
export const $$userConfigMap = withConfigType(finalConfig);

console.log("api-auto finalConfig", finalConfig);

const Apis = createApis(alovaInstance, $$userConfigMap);

export default Apis;
