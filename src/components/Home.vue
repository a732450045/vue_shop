<template>
<div class="home">
  <el-container class="home-container">
<!--    头部区域-->
    <el-header>
      <div class="logo_font">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
<!--    页面主体区域-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--          侧边栏菜单区域-->
        <el-menu
        background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse"
        :collapse-transition="false" router default-active="/users">
<!--          一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
<!--            一级菜单模板区域-->
            <template slot="title">
<!--              图标-->
              <i :class="iconObj[item.id]"></i>
<!--              文本-->
              <span>{{item.authName}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!--              图标-->
                <i class="el-icon-menu"></i>
                <!--              文本-->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
<!--      右侧内容主题-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
export default {
  data () {
  // 左侧菜单数据
    // eslint-disable-next-line no-labels,no-unused-expressions
    return {
      menulist: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'

      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenulist()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenulist () {
      // eslint-disable-next-line no-unused-vars
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 折叠与展开菜单栏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存登录链接选中状态
    // eslint-disable-next-line no-undef
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home {
    height: 100%;
  }
  .home-container {
    height: 100%;
  }
.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: lightgray;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    margin: 20px;
    span {
      margin-left: 10px;
    }
  }
}
.logo_img {
  width: 55px;
  border-radius: 50%;
}
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }

  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
.toggle-button {
  background-color: #4A5064;
  color: gray;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
