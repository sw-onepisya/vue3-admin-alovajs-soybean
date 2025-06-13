<script setup>
import { computed, h, reactive, ref } from 'vue';
import { useThrottleFn } from '@vueuse/core';
import { NAlert, NButton, NCard, NDataTable, NDatePicker, NFormItem, NGi, NGrid, NInput, NSelect, NSpace, NTag } from 'naive-ui';
import { usePagination, useRequest } from '@sa/alova/client';
import Apis from '@/service-alova/api-auto';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 配置 dayjs 插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '未审批', value: 'pending' },
  { label: '已同意', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '已取消', value: 'cancelled' }
];

// 搜索参数
const searchParams = reactive({
  visitorName: '',
  visitorDepartment: '',
  phone: '',
  receptionistName: '',
  status: '',
  validBeginTime: null, // 访问开始时间
  validEndTime: null    // 访问结束时间
});

// 过滤空值的搜索参数
const filteredSearchParams = computed(() => {
  const params = {};
  Object.keys(searchParams).forEach(key => {
    if (key === 'status') {
      // 根据状态值设置对应的参数
      const statusValue = searchParams.status;
      if (statusValue === 'pending') {
        params.isApproval = '0'; // 未审批
      } else if (statusValue === 'approved') {
        params.isAgree = '1'; // 已同意
        params.isApproval = '1'; // 已审批
      } else if (statusValue === 'rejected') {
        params.isAgree = '0'; // 已拒绝
        params.isApproval = '1'; // 已审批
      } else if (statusValue === 'cancelled') {
        params.isCancel = '1'; // 已取消
      }
    }
    else if (key === 'validBeginTime' || key === 'validEndTime') {
      // 处理时间字段
      // 处理时间字段
      if (searchParams[key]) {
        console.log('validBeginTime', searchParams[key]);
        // 使用 dayjs 将时间戳转换为后端期望的 yyyy-MM-dd HH:mm 格式，并设置为 GMT+8 时区
        params[key] = dayjs(searchParams[key]).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
      }
    }
    // 如果是空值或'全部'，则不添加任何状态参数
    else if (searchParams[key] && searchParams[key].trim()) {
      params[key] = searchParams[key].trim();
    }
  });
  return params;
});

// 使用 alova 的 usePagination 策略
const { loading, data, page, pageSize, total, reload, send } = usePagination(
  (currentPage, currentPageSize) => {
    console.log('currentPage', currentPage);
    console.log('currentPageSize', currentPageSize);
    console.log('filteredSearchParams.value', filteredSearchParams.value);
    return Apis.general.queryPageUsingGET({
      params: {
        pageNum: currentPage,
        pageSize: currentPageSize,
        ...filteredSearchParams.value
      }
    });
  },
  {
    initialData: {
      total: 0,
      data: []
    },
    initialPage: 1,
    // initialPageSize: 10,
    initialPageSize: 1, // 为了测试
    total: res => {
      return res?.total || 0;
    },
    data: res => res?.records || [],
    watchingStates: [filteredSearchParams],
    debounce: 1000
  }
);

// 创建节流版本的 reload 函数，防止频繁调用
const throttledReload = useThrottleFn(reload, 1000); // 1秒内最多执行一次

// 表格列定义
const columns = [
  {
    title: '访问企业',
    key: 'visitCompany',
    width: 120,
    render: () => '浙江清翔越'
  },
  {
    title: '被访人',
    key: 'receptionistName',
    width: 120,
    fixed: 'left'
  },
  {
    title: '审批状态',
    key: 'status',
    width: 100,
    render: row => {
      const { status, type } = getStatusInfo(row);
      return h(NTag, { type }, { default: () => status });
    },
    fixed: 'left'
  },
  {
    title: '预约人',
    key: 'visitorName',
    width: 100
  },
  {
    title: '所属企业',
    key: 'visitorDepartment',
    width: 150,
    render: row => row.visitorDepartment || '-'
  },
  {
    title: '手机号',
    key: 'phone',
    width: 130
  },
  {
    title: '随同人数',
    key: 'visitorCount',
    width: 100
  },
  {
    title: '身份证号',
    key: 'identityNo',
    width: 180
  },
  {
    title: '车牌号码',
    key: 'plateNo',
    width: 120,
    render: row => row.plateNo || '-'
  },
  {
    title: '访客类型',
    key: 'visitorType',
    width: 100,
    render: row => formatVisitorType(row.visitorType)
  },
  {
    title: '预约时间',
    key: 'appointmentTime',
    width: 300,
    render: row => formatAppointmentTime(row.validBeginTime, row.validEndTime)
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
    render: row => formatCreateTime(row.createTime)
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right',
    render: row => {
      return h(
        NSpace,
        { justify: 'start' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                disabled: releaseLoading.value,
                onClick: () => {
                  // TODO: onepisya 接入后端 API
                  console.log('查看详情', row);
                  // Apis.general.releaseVisitorUsingPost({
                  //   data: row
                  // }).send()
                  release(row).then(res => {
                    console.log('then release success', res);
                    // TODO: 发送通知 放行成功
                    // 我们可使用的 API
                    window.$notification.success({
                      title: '放行成功',
                      content: '已向被访人发送通知',
                      duration: 3000
                    })


                  })
                }
              },
              { default: () => '放行' }
            )
          ]
        }
      );
    }
  }
];

const { send: release, loading: releaseLoading, error: releaseError } = useRequest(
  (row) => Apis.general.releaseVisitorUsingPost({
    data: row
  }),
  {
    onSuccess: res => {
      console.log('release success', res);
    },
    immediate: false
  })



// 分页配置
const paginationReactive = computed(() => {
  return {
    page: page.value,
    pageSize: pageSize.value,
    itemCount: total.value,
    defaultPageSize: pageSize.value,
    showSizePicker: true,
    pageSizes: [1, 10, 20, 50, 100],
    showQuickJumper: true,
    prefix: e => {
      console.log('e', e);
      const { itemCount } = e;
      return `共 ${itemCount} 条`;
    },
    onUpdatePage: currentPage => {
      page.value = currentPage;
    },
    onUpdatePageSize: currentPageSize => {
      pageSize.value = currentPageSize;
      page.value = 1;
    }
  };
});

// 搜索处理
const handleSearch = () => {
  send();
};

// 重置处理
const handleReset = () => {
  Object.keys(searchParams).forEach(key => {
    if (key === 'validBeginTime' || key === 'validEndTime') {
      searchParams[key] = null; // 时间字段重置为null
    } else {
      searchParams[key] = ''; // 其他字段重置为空字符串
    }
  });
  throttledReload(); // 使用节流版本的 reload
};

// 格式化函数
const getStatusInfo = row => {
  // 优先级：已取消 > 已审批(同意/拒绝) > 未审批
  if (row.isCancel === '1') {
    return { status: '已取消', type: 'default' };
  }

  if (row.isApproval === '1') {
    if (row.isAgree === '1') {
      return { status: '已同意', type: 'success' };
    } else if (row.isAgree === '0') {
      return { status: '已拒绝', type: 'error' };
    }
  }

  return { status: '未审批', type: 'warning' };
};

const formatVisitorType = type => {
  if (type === '1') return '送货';
  if (type === '2') return '访客';
  return type || '-';
};

const formatAppointmentTime = (beginTime, endTime) => {
  if (!beginTime || !endTime) return '-';

  const formatDate = dateStr => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return `${formatDate(beginTime)} ~ ${formatDate(endTime)}`;
};

const formatCreateTime = timeStr => {
  if (!timeStr) return '-';
  const date = new Date(timeStr);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// ---------- 表格导出相关 ----------------

// 前端导出 - 导出全部数据
const handleExportAll = async () => {
  try {
    // 获取所有数据进行导出
    const response = await Apis.general.queryPageUsingGET({
      params: {
        pageNum: 1,
        pageSize: 10000, // 设置一个较大的数值获取所有数据
        ...filteredSearchParams.value
      }
    })

    if (response?.records) {
      debugger
      exportToCSV(response.records, '访客数据_全部')
    }
  } catch (error) {
    console.error('导出失败:', error)
  }
}

// 前端导出 - 导出当前页数据
const handleExportCurrent = () => {
  if (data.value && data.value.length > 0) {
    exportToCSV(data.value, `访客数据_第${page.value}页`)
  }
}

// CSV导出函数
const exportToCSV = (dataList, filename) => {
  const headers = [
    '访问企业',
    '被访人',
    '预约人',
    '所属企业',
    '手机号',
    '随同人数',
    '身份证号',
    '车牌号码',
    '访客类型',
    '预约时间',
    '创建时间',
    '状态'
  ]

  const csvContent = [
    headers.join(','),
    ...dataList.map(row => {
      const { status } = getStatusInfo(row) // 使用正确的方法名
      return [
        '浙江清翔越',
        row.receptionistName || '',
        row.visitorName || '',
        row.visitorDepartment || '',
        row.phone || '',
        row.visitorCount || '',
        row.identityNo || '',
        row.plateNo || '',
        formatVisitorType(row.visitorType),
        formatAppointmentTime(row.validBeginTime, row.validEndTime),
        formatCreateTime(row.createTime),
        status // 使用从 getStatusInfo 获取的状态
      ].map(field => `"${field}"`).join(',')
    })
  ].join('\n')

  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 后端导出 - 导出全部数据
const handleBackendExportAll = async () => {
  try {
    const response = await Apis.general.exportAllVisitorDataUsingGET({
      params: {
        ...filteredSearchParams.value
      },
      // responseType: 'blob' // 重要：设置响应类型为blob
    })

    // 下载Excel文件
    downloadExcelFile(response, '访客数据_全部.xlsx')
  } catch (error) {
    console.error('后端导出失败:', error)
  }
}

// 后端导出 - 导出当前页数据
const handleBackendExportCurrent = async () => {
  try {
    const response = await Apis.general.exportVisitorPageDataUsingGET({
      params: {
        pageNum: page.value,
        pageSize: pageSize.value,
        ...filteredSearchParams.value
      },
      // responseType: 'blob' // 重要：设置响应类型为blob
    })

    // 下载Excel文件
    downloadExcelFile(response, `访客数据_第${page.value}页.xlsx`)
  } catch (error) {
    console.error('后端导出失败:', error)
  }
}

// 下载Excel文件的通用函数
const downloadExcelFile = (blob, filename) => {
  // 创建blob URL
  const url = window.URL.createObjectURL(new Blob([blob], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }))

  // 创建下载链接
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  // 触发下载
  document.body.appendChild(link)
  link.click()

  // 清理
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

</script>

<template>
  <div class="p-6">
    <!-- 搜索表单 -->
    <NCard class="mb-4">
      <NGrid :x-gap="16" :y-gap="16" :cols="24" responsive="screen">
        <NGi :span="6" :s="12" :xs="24">
          <NFormItem label="预约人">
            <NInput v-model:value="searchParams.visitorName" placeholder="请输入预约人姓名" clearable />
          </NFormItem>
        </NGi>
        <NGi :span="6" :s="12" :xs="24">
          <NFormItem label="所属企业">
            <NInput v-model:value="searchParams.visitorDepartment" placeholder="请输入所属企业" clearable />
          </NFormItem>
        </NGi>
        <NGi :span="6" :s="12" :xs="24">
          <NFormItem label="手机号">
            <NInput v-model:value="searchParams.phone" placeholder="请输入预约人手机号" clearable />
          </NFormItem>
        </NGi>
        <NGi :span="6" :s="12" :xs="24">
          <NFormItem label="被访人">
            <NInput v-model:value="searchParams.receptionistName" placeholder="请输入被访人姓名" clearable />
          </NFormItem>
        </NGi>
        <NGi :span="6" :s="12" :xs="24">
          <NFormItem label="状态">
            <NSelect v-model:value="searchParams.status" placeholder="请选择状态" clearable :options="statusOptions" />
          </NFormItem>
        </NGi>
        <NGi :span="6" :s="12" :xs="24">
          <NFormItem label="访问开始时间">
            <NDatePicker v-model:value="searchParams.validBeginTime" type="datetime" placeholder="请选择访问开始时间" clearable
              format="yyyy-MM-dd HH:mm:ss" />
          </NFormItem>
        </NGi>
        <NGi :span="6" :s="12" :xs="24">
          <NFormItem label="访问结束时间">
            <NDatePicker v-model:value="searchParams.validEndTime" type="datetime" placeholder="请选择访问结束时间" clearable
              format="yyyy-MM-dd HH:mm:ss" />
          </NFormItem>
        </NGi>
        <NGi :span="24">
          <NSpace justify="end">
            <NButton type="primary" :disabled="loading" @click="handleSearch">
              <template #icon>
                <icon-uil-search v-show="!loading" class="text-icon" />
                <icon-mdi-refresh v-show="loading" class="text-icon" :class="{ 'animate-spin': loading }" />
              </template>
              搜索
            </NButton>
            <NButton :disabled="loading" @click="handleReset">
              <template #icon>
                <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
              </template>
              重置
            </NButton>
          </NSpace>
        </NGi>
      </NGrid>
    </NCard>

    <!-- 提示信息 -->
    <NAlert type="info" class="mb-4">
      <template #icon>
        <icon-mdi-information />
      </template>
      提示：shift + 鼠标滚轮 可以控制表格横向滚动。
    </NAlert>

    <!-- 表格操作栏 -->
    <!-- 
    <NCard class="mb-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <span class="text-base font-medium">数据操作-前端导出</span>
        </div>
        <NSpace>
          <NButton type="primary" @click="handleExportAll">
            <template #icon>
              <icon-mdi-download class="text-icon" />
            </template>
            导出全部数据
          </NButton>
          <NButton @click="handleExportCurrent">
            <template #icon>
              <icon-mdi-file-export class="text-icon" />
            </template>
            导出当前页
          </NButton>
        </NSpace>
      </div>
    </NCard>
    -->

          <!-- 后端导出 -->
    <NCard class="mb-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <span class="text-base font-medium">数据操作</span>
        </div>
        <NSpace>
          <NButton type="primary" @click="handleBackendExportAll">
            <template #icon>
              <icon-mdi-download class="text-icon" />
            </template>
            导出全部数据
          </NButton>
          <NButton @click="handleBackendExportCurrent">
            <template #icon>
              <icon-mdi-file-export class="text-icon" />
            </template>
            导出当前页
          </NButton>
        </NSpace>
      </div>
    </NCard>
    <!-- 数据表格 remote 很重要、要设置为后端分页。 -->
    <NCard>
      <NDataTable max-height="500" :remote="true" :columns="columns" :data="data" :loading="loading"
        :pagination="paginationReactive" :scroll-x="1800" striped size="small" />
    </NCard>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
