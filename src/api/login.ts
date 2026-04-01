import { post } from './request'
import {
  getNullableNumberField,
  getStringField,
  result,
  toAccessProfileData,
  toRecord,
  toSessionUserProfile,
} from '@/http/response'

// 处理当前注册流程，把账号信息正式写入系统。
export const register = ({ account, password }) =>
  post('/api/register', { account, password }).then((raw) => result(raw, null))

// 处理当前登录流程，在认证通过后建立当前会话。
export const login = ({ account, password }) =>
  post('/api/login', { account, password }).then((raw) =>
    result(raw, {
      accessToken: getStringField(raw, 'accessToken'),
      token: getStringField(raw, 'token'),
      user: toSessionUserProfile(toRecord(raw).results),
    }),
  )

// 刷新Token，避免旧凭证过期后直接中断当前会话。
export const refreshToken = () =>
  post('/api/refresh', undefined, { _skipAuthRefresh: true }).then((raw) =>
    result(raw, {
      accessToken: getStringField(raw, 'accessToken'),
    }),
  )

// 处理当前退出流程，把会话和相关凭证一起清掉。
export const logout = () =>
  post('/api/logout', undefined, { _skipAuthRefresh: true }).then((raw) => result(raw, null))

// 处理鉴权资料，把当前模块的关键逻辑集中在这里。
export const authProfile = () =>
  post('/api/authProfile').then((raw) => result(raw, toAccessProfileData(raw)))

// 校验当前请求，避免不符合条件的操作继续下发。
export const verify = ({ account, email }) =>
  post('/user/verifyAccountAndEmail', { account, email }).then((raw) =>
    result(raw, { id: getNullableNumberField(raw, 'id') }),
  )

// 重置当前状态，把当前流程恢复到干净初始状态。
export const reset = (id, newPassword) =>
  post('/user/changePasswordInLogin', { id, newPassword }).then((raw) => result(raw, null))
