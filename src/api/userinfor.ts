import instance from '@/http/index'

// 获取用户信息
export const getUserInfo = (id: number) => {
  return instance({
    url: '/user/getUserInfo',
    method: 'POST',
    data: {
      id,
    },
  })
}

// 绑定图片地址跟账号
export const bind = (account: string, onlyId: any, url: any) => {
  return instance({
    url: '/user/bindAccount',
    method: 'POST',
    data: {
      account,
      onlyId,
      url,
    },
  })
}

// 修改密码
export const changePassword = (id: number, oldPassword: string, newPassword: string) => {
  return instance({
    url: '/user/changePassword',
    method: 'POST',
    data: {
      id,
      oldPassword,
      newPassword,
    },
  })
}

// 修改姓名
export const changeName = (name: string, id: number) => {
  return instance({
    url: '/user/changeName',
    method: 'POST',
    data: {
      name,
      id,
    },
  })
}

// 修改性别
export const changeSex = (sex: string, id: number) => {
  return instance({
    url: '/user/changeSex',
    method: 'POST',
    data: {
      sex,
      id,
    },
  })
}

// 修改邮箱
export const changeEmail = (email: string, id: number) => {
  return instance({
    url: '/user/changeEmail',
    method: 'POST',
    data: {
      email,
      id,
    },
  })
}
