<template>
<div class="login_container">
<!--  登录框区域-->
  <div class="login_box">
<!--   头像区域-->
  <div class="avatar_box"><img src="../assets/IMG_4286.jpg" alt=""></div>
<!-- 登录表单区域-->
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_Form">
<!--      用户名-->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
<!--      密码-->
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
      </el-form-item>
<!--      按钮区域-->
      <el-form-item class="btns">
        <el-button type="primary" round @click="login">登录</el-button>
        <el-button type="info" round @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
  // 点击重置按钮, 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 20px;
    .avatar_box {
      border: 1px solid #000;
      background-color: #fff;
      width: 130px;
      height: 130px;
      border-radius: 50% ;
      position: absolute;
      left: 50%;
      top: -25%;
      transform: translate(-50%);
      box-shadow: 0 0 15px gray;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50% ;

      }
    }
    .login_Form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  .btns {
display: flex;
justify-content: flex-end;
  }
  }
  }
</style>
