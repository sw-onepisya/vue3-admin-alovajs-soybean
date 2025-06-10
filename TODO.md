- 封装自己的 createAlova 实例、之前写过的、不过需要考虑和现有的进行结合。
- 统一下、API都是用 alova.js、包括默认的登录之类的
- TODO: onepisya 在 packags 中重写 sa/alova 为自己的 alova-onepisya、 我可能会重新在一个分支中进行维护、添加我需要的功能。

现在的后台有处理 beforeRequest 和 responded 

使用了 createServerTokenAuthentication、

中的拦截器 onAuthRequired, onResponseRefreshToken 来处理 refreshToken

鉴权都要、一个是请求拦截器、 一个响应拦截器。


提供了 `isBackendSuccess` 来判断是否后端请求成功。
提供了 `transformBackendResponse` 来转换后端返回的数据。

提供 `onError` 来处理错误。

支持原来的 `onCompleted` 回调函数

支持 `tokenRefresher` 会传递给 `alova.js` 的 `createServerTokenAuthentication` 的 成功和失败回调函数。

> 但是与我自己的相比起来缺少了很多东西、

比如 createServerTokenAuthentication 中的 login, assignToken, logout, 不使用了、仅仅使用了 refreshToken 中的 isExpired 和 handler

以及无法自定义 createServerTokenAuthentication 中的参数了

比如   
- visitorMeta, 标识访客身份、这样在 assignToken 中就不会附加 token 了
- login,  这个也不会附加 token
- logout,
- assignToken = noop
- refreshToken, 原来的后台有处理它


