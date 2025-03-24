import request from '@/config/axios'

export interface OouBoundVO {
  id :number;
  number:string;
  sampleName: string;
  outboundPerson :string;
  outboundTime:Date;
  purpose :string;
  annexOut:string;
  applyPerson:string;
  applyUnit:string;
  applyTime:Date;
  returnExpect:string;
  reviewPerson:string;
  reviewTime: LocalDateTime;
  rejectSeason:string;
  returnPerson:string;
  returnTime:LocalDateTime;
  receivePerson:string;
  annexReturn:string;
  nots:string;
  state:Integer;
}

export interface UpdateStatusReqVO {
  id: number
  status: number
}

export const getPage = (params) => {
  return request.get({ url: '/museum/flow/pagePerson', params })
}

// 查询角色列表
export const getRolePage = async (params: PageParam) => {
  return await request.get({ url: '/system/Out/page', params })
}

// 查询角色（精简)列表
export const getSimpleRoleList = async (): Promise<RoleVO[]> => {
  return await request.get({ url: '/system/role/simple-list' })
}

// 查询角色详情
export const getRole = async (id: number) => {
  return await request.get({ url: '/system/Out/get?id=' + id })
}

// 新增出库表单
export const createOutBound = async (data) => {
  return await request.post({ url: '/museum/flow/outbound', data })
}

// 跟新表单
export const updateForm = async (data) => {
  return await request.put({ url: '/museum/flow/update', data })
}

// 修改角色状态
export const updateRoleStatus = async (data: UpdateStatusReqVO) => {
  return await request.put({ url: '/system/Out/update-status', data })
}

// 删除角色
export const deleteRole = async (id: number) => {
  return await request.delete({ url: '/system/Out/delete?id=' + id })
}

// 导出角色
export const exportRole = (params) => {
  return request.download({
    url: '/system/Out/export-excel',
    params
  })
}
