<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图区域-->
    <el-card class="box-card">
        <!--      搜索-->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
<!--      用户列表区域-->
<el-table :data="userlist">
  <el-table-column type="index"></el-table-column>
  <el-table-column label="姓名" prop="username"></el-table-column>
  <el-table-column label="邮箱" prop="email"></el-table-column>
  <el-table-column label="电话" prop="mobile"></el-table-column>
  <el-table-column label="角色" prop="role_name"></el-table-column>
  <el-table-column label="状态" prop="mg_state">
  <template slot-scope="scope">
    <el-switch v-model="scope.row.mg_state" @change="usertateChanged(scope.row)">
    </el-switch>
  </template>
  </el-table-column>
  <el-table-column label="操作">
    <template slot-scope="scope">
<!--      修改-->
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
<!--      删除-->
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUsuerById(scope.row.id)"></el-button>
<!--      分配角色-->
      <el-tooltip class="item" effect="dark" content="角色设置" placement="top">
        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
      </el-tooltip>
    </template>
  </el-table-column>
 </el-table>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
<!-- 添加用户的对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDIalogClosed"
      >
        <el-form :model="addForm" :rules="addFormRules" ref="addRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
      </el-dialog>
<!--      修改用户的对话框-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    // eslint-disable-next-line no-unused-vars
    var checkEmail = (rule, value, cb) => {
      // eslint-disable-next-line no-unused-vars,no-useless-escape
      const regEmali = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmali.test(value)) {
      // 合法邮箱
        return cb()
        // 非法邮箱
        // eslint-disable-next-line no-unreachable
      }
      cb(new Error('请输入合法邮箱'))
    }

    // 验证手机的规则
    // eslint-disable-next-line no-unused-vars
    var checkMobile = (rule, value, cb) => {
      // eslint-disable-next-line no-unused-vars
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号码'))
    }
    return {
    //  获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前显示多少条数据
        pagesize: 2
      },
      // eslint-disable-next-line no-undef
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //  验证规则
      addFormRules: {
        username: [
          // eslint-disable-next-line standard/object-curly-even-spacing
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名的长度在6-15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

        ]
      },
      editDialogVisible: false,
      //  查询到的用户信息对象
      editForm: {},
      // 修改表单验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // eslint-disable-next-line no-unused-vars
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return ('获取用户列表失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    //  监听pagesize改变的事件
    handleSizeChange (newSiez) {
      this.queryInfo.pagesize = newSiez
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听swtich开关状态的改变
    async usertateChanged (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户添加对话框关闭的事件
    addDIalogClosed () {
      // eslint-disable-next-line no-unused-expressions
      this.$refs.addRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser () {
      this.$refs.addRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    //  展示编辑的对话框
    async showEditDialog (id) {
      // eslint-disable-next-line no-unused-vars
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // eslint-disable-next-line no-undef,no-useless-return
        if (!valid) return
        // 发起修改用户信息的请求
        // eslint-disable-next-line no-unused-vars
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          emlail: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        //  刷新数据列表
        this.getUserList()
        //  提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },
    // 根据ID删除对应的用户信息
    async removeUsuerById (id) {
    // 弹框询问是否删除数据
      // eslint-disable-next-line no-unused-vars
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err
      )
      // 如果用户确认删除 则返回为字符串confirm
      // 如果用户取消了删除 则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // eslint-disable-next-line no-unused-vars
      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style scoped>

</style>
