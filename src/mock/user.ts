const projectList = [{
  status: 200,
  message: 'success',
  data: {
    total: 100,
    'data|10': [{
      id: '@guid',
      'name|1': ['岳阳市财政数据中心', '临湘市财政数据中心', '郴州市云核算', '衡山县财政数据中心'],
      'status|1': ['已完成', '待付款', '已废止'],
      createDate: '2022年1月24日',
      'product|1': ['财政数据中心区县级普通版', '财政数据中心区县级增强版', '用友云核算'],
      'owner|1': ['罗真', '姚竞', '曾武本', '何晋华'],
      'amount|1': /(^([1-9]{3,4})(\.\d{1,2})?$)|(^10000$)/
    }]
  }
}]
const detail = [{
  status: 200,
  message: 'success',
  data: {
    'active|1': [1, 2, 3],
    setupList: [
      { title: '立项', description: '中标日期: 2022年1月24日\n合同日期: 2022年1月24日', desc1: '中标日期: 2022年1月24日', desc2: '合同日期: 2022年1月24日', id: 'lx' },
      { title: '实施中', description: '第一阶段付款: 2022年1月24日', id: 'ssz' },
      { title: '项目验收', description: '进行中', id: 'xmys' },
      { title: '项目完成', description: '合同终止日期: 2025年1月24日', id: 'xmwc' }
    ],
    detailList: [
      { name: '项目名称', prop: '衡山县财政数据中心' },
      { name: '立项日期', prop: '2022年1月24日' },
      { name: '项目类型', prop: '自营软件项目' },
      { name: '责任人', prop: '姚竞' },
      { name: '是否招标项目', prop: '招投标项目' },
      { name: '中标日期', prop: '2022年1月24日' },
      { name: '采购金额', prop: '100000.00' },
      { name: '销售金额', prop: '2000000.00' },
      { name: '项目产品', prop: '财政数据中心区县基础版' },
      { name: '是否已验收', prop: '否' }
    ]
  }
}]
const contractDetails = [{
  status: 200,
  message: 'success',
  data: {
    'purchaseData|8': [
      {
        'date|1': ['2016-05-02', '2016-05-03', '2016-05-04', '2016-05-05'],
        'name|1': ['服务器采购合同', '机房建设合同', '硬件数据恢复合同'],
        'status|1': ['完成', '进行', '待付款'],
        'amount|1': /^([1-9]{5,6})(\.\d{2})?$/
      }
    ],
    'paymentPlan|5': [
      {
        'date|1': ['2016-05-02', '2016-05-06', '2016-05-08', '未付款'],
        'rate|1': /^([1-9]{1,2})%$/,
        'amount|1': /^([1-9]{5,6})(\.\d{2})?$/
      }
    ]
  }
}]
const ownerList = [{
  status: 200,
  message: 'success',
  data: {
    data: [
      { label: '罗真-总经理', value: '罗真' },
      { label: '姚竞-总经理助理', value: '姚竞' },
      { label: '曾武本-副总经理', value: '曾武本' },
      { label: '何晋华-实施部经理', value: '何晋华' }
    ]
  }
}]
const productList = [{
  status: 200,
  message: 'success',
  data: {
    data: [
      { value: '财政数据中心-区县基础版', label: '财政数据中心-区县基础版' },
      { value: '财政数据中心-区县加强版', label: '财政数据中心-区县加强版' }
    ]
  }
}]
const regionList = [{
  status: 200,
  message: 'success',
  data: {
    data: [{
      value: '湖南省',
      label: '湖南省',
      children: [{
        value: '长沙市',
        label: '长沙市',
        children: [{
          value: '岳麓区',
          label: '岳麓区'
        }, {
          value: '开福区',
          label: '开福区'
        }, {
          value: '雨花区',
          label: '雨花区'
        }, {
          value: '望城区',
          label: '望城区'
        }]
      },
      {
        value: '株洲市',
        label: '株洲市'
      }]
    }]
  }
}]
const attLibraryList = [{
  status: 200,
  message: 'success',
  data: {
    total: 100,
    'data|12': [
      {
        id: '@guid',
        'date|1': ['2016-05-02', '2016-05-04', '2016-05-06', '2016-05-08'],
        'name|1': ['xx采购合同', 'xx中标通知书', 'xx销售合同', 'xx验收清单'],
        'product|1': ['衡山'],
        'fileType|1': ['采购合同', '中标通知书', '销售合同', '验收清单'],
        product2: '会计云核算-衡山县财政局-软件代理销售',
        'enclosureType|1': ['PDF', '图片'],
        'url|1': ['https://t7.baidu.com/it/u=4036010509,3445021118&fm=193&f=GIF']
      }
    ]
  }
}]
const userList = [{
  status: 200,
  message: 'success',
  data: {
    total: 100,
    'data|10': [{
      code: '@guid',
      name: '@cname',
      'sex|1': [0, 1],
      'depart|1': ['总经办', '行政部', '业务部', '研发部'],
      'date|1': [],
      'status|1': ['在职', '离职']
    }]
  }
}]
const roleList = [{
  status: 200,
  message: 'success',
  data: {
    total: 2,
    'data|2': [{
      code: '@guid',
      'name|1': ['超级管理员', '管理员', '普通用户', '系统管理员']
    }]
  }
}]
const allRoleList = [{
  status: 200,
  message: 'success',
  data: {
    total: 6,
    'data|6': [{
      id: '@guid',
      code: '@guid',
      'name|1': ['超级管理员', '管理员', '普通用户', '系统管理员'],
      'permission|1': ['范围1', '范围2', '范围3'],
      level: /([1-4]){1}/,
      'desc|1': ['描述一', '描述二', '描述三'],
      'createDate|1': ['2022-02-22']
    }]
  }
}]
const workList = [{
  status: 200,
  message: 'success',
  data: {
    total: 6,
    'data|6': [{
      id: '@guid',
      'name|1': ['岳阳市财政数据中心', '临湘市财政数据中心', '郴州市云核算', '衡山县财政数据中心'],
      'status|1': ['已完成', '待付款', '已废止'],
      createDate: '2022年1月24日',
      'product|1': ['财政数据中心区县级普通版', '财政数据中心区县级增强版', '用友云核算'],
      'desc|1': ['第二次付款计划进行中', '第三次付款计划进行中', '第一次付款计划进行中'],
      'amount|1': /(^([1-9]{3,4})(\.\d{1,2})?$)|(^10000$)/
    }]
  }
}]
const login = [{
  status: 200,
  message: 'success',
  data: {
    user: {
      userInfo: {
        id: '1001001',
        username: 'admin'
      }
    },
    token: 'asdfghjkl'
  }
}]
const menuList = [{
  status: 200,
  message: 'success',
  data: [
    {
      id: 1,
      label: '工作台'
    }
  ]
}]
export default {
  'post|api/projectList': projectList,
  'post|api/detail': detail,
  'post|api/contractDetails': contractDetails,
  'post|api/ownerList': ownerList,
  'post|api/productList': productList,
  'post|api/regionList': regionList,
  'post|api/attLibrary': attLibraryList,
  'post|api/userList': userList,
  'post|api/roleList': roleList,
  'post|api/allRoleList': allRoleList,
  'post|api/workList': workList,
  'post|api/login': login,
  'post|api/menuList': menuList
}
