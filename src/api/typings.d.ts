declare namespace API {
  type AppAddRequest = {
    /** 应用初始化的 prompt */
    initPrompt: string
    /** 应用封面URL */
    cover?: string
    /** 代码生成类型：html-原生HTML模式，multi_file-原生多文件模式 */
    codeGenType?: string
  }

  type AppAdminUpdateRequest = {
    /** 应用ID */
    id: number
    /** 应用名称 */
    appName?: string
    /** 应用封面URL */
    cover?: string
    /** 应用初始化的 prompt */
    initPrompt?: string
    /** 代码生成类型：html-原生HTML模式，multi_file-原生多文件模式 */
    codeGenType?: string
    /** 优先级 */
    priority?: number
    /** 创建用户ID */
    userId?: number
  }

  type AppDeployRequest = {
    /** 应用ID */
    appId: number
  }

  type AppQueryRequest = {
    pageNum?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    /** 应用ID */
    id?: number
    /** 应用名称 */
    appName?: string
    /** 应用初始化的 prompt */
    initPrompt?: string
    /** 代码生成类型：html-原生HTML模式，multi_file-原生多文件模式 */
    codeGenType?: string
    /** 优先级 */
    priority?: number
    /** 创建用户ID */
    userId?: number
    /** 搜索关键词 */
    searchText?: string
    ascending?: boolean
    offset?: number
  }

  type AppUpdateRequest = {
    /** 应用ID */
    id: number
    /** 应用名称 */
    appName?: string
    /** 应用封面URL */
    cover?: string
  }

  type AppVO = {
    /** id */
    id?: number
    /** 应用名称 */
    appName?: string
    /** 应用封面 */
    cover?: string
    /** 应用初始化的 prompt */
    initPrompt?: string
    /** 代码生成类型 */
    codeGenType?: string
    /** 部署标识 */
    deployKey?: string
    /** 部署时间 */
    deployedTime?: string
    /** 优先级 */
    priority?: number
    /** 创建用户id */
    userId?: number
    /** 编辑时间 */
    editTime?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    user?: UserVO
  }

  type banUserParams = {
    userId: number
  }

  type BaseResponseAppVO = {
    code?: number
    data?: AppVO
    message?: string
    success?: boolean
  }

  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
    success?: boolean
  }

  type BaseResponseCodeGenerateVO = {
    code?: number
    data?: CodeGenerateVO
    message?: string
    success?: boolean
  }

  type BaseResponseCodeGenTypeEnumArray = {
    code?: number
    data?: ('HTML' | 'MULTI_FILE')[]
    message?: string
    success?: boolean
  }

  type BaseResponseListString = {
    code?: number
    data?: string[]
    message?: string
    success?: boolean
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
    success?: boolean
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
    success?: boolean
  }

  type BaseResponseMapStringObject = {
    code?: number
    data?: Record<string, any>
    message?: string
    success?: boolean
  }

  type BaseResponsePageAppVO = {
    code?: number
    data?: PageAppVO
    message?: string
    success?: boolean
  }

  type BaseResponsePageUserVO = {
    code?: number
    data?: PageUserVO
    message?: string
    success?: boolean
  }

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
    success?: boolean
  }

  type BaseResponseUser = {
    code?: number
    data?: User
    message?: string
    success?: boolean
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
    success?: boolean
  }

  type BatchUserOperationRequest = {
    /** 用户ID列表 */
    userIds: number[]
    /** 操作类型：delete-删除，ban-封禁，unban-解封，role-修改角色 */
    operation: string
    /** 操作参数（如角色类型） */
    parameter?: string
  }

  type BindEmailRequest = {
    /** 邮箱地址 */
    email: string
    /** 验证码 */
    code: string
  }

  type ChangePasswordRequest = {
    /** 当前密码 */
    oldPassword: string
    /** 新密码 */
    newPassword: string
    /** 确认新密码 */
    confirmPassword: string
  }

  type chatToGenCodeParams = {
    appId: number
    message: string
  }

  type CodeGenerateRequest = {
    /** 用户消息/需求描述 */
    userMessage: string
    /** 生成类型：html-原生HTML模式，multi_file-原生多文件模式 */
    codeGenType: string
  }

  type CodeGenerateVO = {
    /** 生成的代码文件保存路径 */
    filePath?: string
    /** 生成类型 */
    codeGenType?: string
    /** 生成描述 */
    description?: string
    /** 是否成功 */
    success?: boolean
    /** 生成时间戳 */
    timestamp?: number
  }

  type DeleteRequest = {
    id: number
  }

  type getAppVOByIdByAdminParams = {
    id: number
  }

  type getAppVOByIdParams = {
    id: number
  }

  type getUserByIdParams = {
    id: number
  }

  type getUserPermissionsParams = {
    userId: number
  }

  type getUserRolesParams = {
    userId: number
  }

  type getUserVOByIdParams = {
    id: number
  }

  type kickoutParams = {
    loginId: string
  }

  type kickoutUserParams = {
    userId: number
  }

  type LoginUserVO = {
    /** 用户id */
    id?: number
    /** 账号 */
    userAccount?: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户角色：user/admin */
    userRole?: string
    /** 用户状态：0-正常，1-禁用 */
    userStatus?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 最后登录时间 */
    lastLoginTime?: string
    /** 访问token */
    token?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageAppVO = {
    records?: AppVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageAppVO
    searchCount?: PageAppVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageUserVO = {
    records?: UserVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUserVO
    searchCount?: PageUserVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type ResetPasswordRequest = {
    /** 邮箱地址 */
    email: string
    /** 验证码 */
    code: string
    /** 新密码 */
    newPassword: string
    /** 确认新密码 */
    confirmPassword: string
  }

  type SendCodeRequest = {
    /** 邮箱地址 */
    email: string
    /** 验证码用途：bind_email-邮箱绑定，reset_password-重置密码，change_email-修改邮箱 */
    purpose: string
  }

  type ServerSentEventString = true

  type unbanUserParams = {
    userId: number
  }

  type UpdateUserRoleRequest = {
    /** 用户ID */
    userId: number
    /** 新角色：user-普通用户，admin-管理员，ban-被封号 */
    newRole: string
  }

  type User = {
    /** id */
    id?: number
    /** 账号 */
    userAccount?: string
    /** 密码 */
    userPassword?: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户角色：user/admin */
    userRole?: string
    /** 用户状态：0-正常，1-禁用 */
    userStatus?: number
    /** 编辑时间 */
    editTime?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 最后登录时间 */
    lastLoginTime?: string
    /** 是否删除 */
    isDelete?: number
  }

  type UserAdminUpdateRequest = {
    /** 用户ID */
    id: number
    /** 用户账号 */
    userAccount?: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户角色：user-普通用户，admin-管理员，ban-被封号 */
    userRole?: string
    /** 用户状态：0-正常，1-禁用 */
    userStatus?: number
  }

  type UserLoginRequest = {
    /** 账号 */
    userAccount: string
    /** 密码 */
    userPassword: string
  }

  type UserQueryRequest = {
    pageNum?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    /** 用户ID */
    id?: number
    /** 用户账号 */
    userAccount?: string
    /** 用户昵称 */
    userName?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户角色：user/admin/ban */
    userRole?: string
    /** 用户状态：0-正常，1-禁用 */
    userStatus?: number
    /** 搜索关键词（账号、昵称、邮箱） */
    searchText?: string
    ascending?: boolean
    offset?: number
  }

  type UserRegisterRequest = {
    /** 账号 */
    userAccount: string
    /** 密码 */
    userPassword: string
    /** 确认密码 */
    checkPassword: string
    /** 用户昵称（可选） */
    userName?: string
    /** 用户邮箱（可选） */
    userEmail?: string
  }

  type UserUpdateMyRequest = {
    /** 用户昵称 */
    userName?: string
    /** 用户头像URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户邮箱 */
    userEmail?: string
  }

  type UserVO = {
    /** id */
    id?: number
    /** 账号 */
    userAccount?: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户邮箱 */
    userEmail?: string
    /** 用户角色：user/admin */
    userRole?: string
    /** 用户状态：0-正常，1-禁用 */
    userStatus?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 最后登录时间 */
    lastLoginTime?: string
  }
}
