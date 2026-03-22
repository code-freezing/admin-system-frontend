<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-wrapped">
        <div class="header-content">
          <h3>通用后台管理系统</h3>
          <span class="welcome">欢迎您的登录</span>
        </div>
      </el-header>
      <el-main>
        <div class="login-wrapped">
          <el-card class="box-card">
            <el-tabs v-model="activeName" class="demo-tabs" :stretch="true">
              <el-tab-pane label="登录" name="first">
                <el-form class="login-form">
                  <el-form-item label="账号">
                    <el-input v-model="loginData.account" placeholder="请输入账号" />
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="loginData.password" placeholder="请输入密码" show-password />
                  </el-form-item>
                  <div class="footer-wrapped">
                    <div class="forget-password">
                      <span class="forget-password-button" @click="openForget">忘记密码</span>
                    </div>
                    <div class="footer-button">
                      <el-button type="primary" @click="loginAction">登录</el-button>
                    </div>
                    <div class="footer-go-register">
                      还没有账号？<span class="go-register">马上注册</span>
                    </div>
                  </div>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="注册" name="second">
                <el-form class="login-form">
                  <el-form-item label="账号">
                    <el-input v-model="registerData.account" placeholder="账号长度6-12位" />
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="registerData.password" placeholder="密码需长度6-12位含字母数字" />
                  </el-form-item>
                  <el-form-item label="确认密码">
                    <el-input v-model="registerData.rePassword" placeholder="请再次输入密码" />
                  </el-form-item>
                  <div class="footer-button">
                    <el-button type="primary" @click="registerAction">注册</el-button>
                  </div>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </el-main>
      <el-footer class="footer-wrapped">
        <div class="footer-content">
          <div class="title">
            <span>网络工程师</span> | <span>全栈工程师</span> | <span>阿里云社区博主专家</span> |
            <span>CSDN百万访问博主</span> | <span>清华大学出版社签约作者</span>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
  <forget ref="forgetP" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import forget from './components/forget_password.vue'
import { login, register, returnMenuList } from '@/api/login'
import { loginLog } from '@/api/log'
import { useUserInfo } from '@/stores/userinfor'
import { useMenu } from '@/stores/menu'
import { setAuthTokens } from '@/utils/auth'

interface AuthForm {
  account: number | null
  password: string
  rePassword?: string
}

const router = useRouter()
const userStore = useUserInfo()
const menuStore = useMenu()

const activeName = ref('first')
const loginData = reactive<AuthForm>({
  account: null,
  password: '',
})
const registerData = reactive<AuthForm>({
  account: null,
  password: '',
  rePassword: '',
})
const forgetP = ref<InstanceType<typeof forget> | null>(null)

const openForget = () => {
  forgetP.value?.open()
}

const loginAction = async () => {
  const res = (await login(loginData)) as any

  if (res?.status !== 0) {
    ElMessage.error('登录失败，请检查账号和密码是否正确')
    return
  }

  const { id, account, name, email, department } = res.results
  const accessToken = res.accessToken || res.token
  const routerList = (await returnMenuList(id)) as any

  if (!accessToken) {
    ElMessage.error('登录态无效，请重新登录')
    return
  }

  ElMessage.success('登录成功')
  menuStore.setRouter(Array.isArray(routerList) ? routerList : [])
  setAuthTokens(accessToken)
  localStorage.setItem('id', String(id))
  localStorage.setItem('name', name)
  localStorage.setItem('department', department ?? '')
  localStorage.setItem('userinfo', JSON.stringify(res.results))

  await userStore.userInfo(id)
  await loginLog(account, name, email)
  await router.push('/menu')
}

const registerAction = async () => {
  if (registerData.password !== registerData.rePassword) {
    ElMessage.error('两次输入的密码不一致，请重新输入')
    return
  }

  const res = (await register(registerData)) as any
  if (res?.status === 0) {
    ElMessage.success('注册成功，请登录')
    activeName.value = 'first'
    return
  }

  ElMessage.error('注册失败，请重试')
}
</script>

<style lang="scss" scoped>
.header-wrapped {
  .header-content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .welcome {
      font-size: 13px;
    }
  }
}

.el-main {
  background-image: url('@/assets/code.jpg');
  height: 600px;
  --el-main-padding: 0;

  .login-wrapped {
    width: 1200px;
    height: 600px;
    margin: 0 auto;

    .box-card {
      width: 350px;
      height: 375px;
      float: right;
      position: relative;
      top: 14%;

      .login-form {
        .footer-wrapped {
          display: flex;
          flex-direction: column;

          .forget-password {
            display: flex;
            justify-content: flex-end;
            margin: 10px 0;

            .forget-password-button {
              font-size: 12px;
              color: #409eff;
              cursor: pointer;
            }
          }

          .footer-go-register {
            font-size: 12px;
            margin: 12px 0;
            display: flex;
            justify-content: center;

            .go-register {
              font-size: 12px;
              color: #409eff;
              cursor: pointer;
            }
          }
        }

        .footer-button {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}

.footer-wrapped {
  margin-top: 10px;

  .footer-content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      color: #666;
    }

    span {
      color: #666;
      font-size: 12px;
    }
  }
}

.el-form {
  margin-top: 30px;
}

:deep(.el-tabs__item) {
  color: #333;
  font-size: 18px;
}

:deep(.el-input__inner) {
  height: 40px;
}

:deep(.el-form-item__label) {
  height: 40px;
  line-height: 40px;
}

:deep(.el-button) {
  width: 300px;
  height: 45px;
  font-size: 16px;
}
</style>
