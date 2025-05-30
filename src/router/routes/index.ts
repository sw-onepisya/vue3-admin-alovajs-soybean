import type { CustomRoute, ElegantConstRoute, ElegantRoute } from '@elegant-router/types';
import { generatedRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { transformElegantRoutesToVueRoutes } from '../elegant/transform';

/**
 * custom routes
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
const customRoutes: CustomRoute[] = [];

/** create routes when the auth route mode is static */
export function createStaticRoutes() {
  // TODO: 17 无需权限的路由 https://docs.soybeanjs.cn/zh/guide/router/dynamic.html#%E5%9B%BA%E5%AE%9A%E8%B7%AF%E7%94%B1-%E6%97%A0%E9%9C%80%E6%9D%83%E9%99%90%E5%8D%B3%E5%8F%AF%E8%BF%9B%E5%85%A5%E7%9A%84%E8%B7%AF%E7%94%B1
  const constantRoutes: ElegantRoute[] = [];
  // TODO: 18 权限路由 https://docs.soybeanjs.cn/zh/guide/router/dynamic.html#%E6%9D%83%E9%99%90%E8%B7%AF%E7%94%B1
  const authRoutes: ElegantRoute[] = [];

  [...customRoutes, ...generatedRoutes].forEach(item => {
    if (item.meta?.constant) {
      constantRoutes.push(item);
    } else {
      authRoutes.push(item);
    }
  });

  return {
    constantRoutes,
    authRoutes
  };
}

/**
 * Get auth vue routes
 *
 * @param routes Elegant routes
 */
export function getAuthVueRoutes(routes: ElegantConstRoute[]) {
  return transformElegantRoutesToVueRoutes(routes, layouts, views);
}
