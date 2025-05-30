import { alova } from '../request';

// TODO: 19 获取无需权限动态路由
/** get constant routes */
export function fetchGetConstantRoutes() {
  return alova.Get<Api.Route.MenuRoute[]>('/route/getConstantRoutes');
}
// TODO: 20 获取需要权限的动态路由
/** get user routes */
export function fetchGetUserRoutes() {
  return alova.Get<Api.Route.UserRoute>('/route/getUserRoutes');
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return alova.Get<boolean>('/route/isRouteExist', { params: { routeName } });
}
