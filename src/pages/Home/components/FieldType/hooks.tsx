import { ProColumns } from '@ant-design/pro-components';
import { useMemo } from 'react';

export const useColumns = () => {
  return useMemo<ProColumns<API.FieldType>[]>(
    () => [
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '额外配置项',
        hideInSearch: true,
        dataIndex: 'options',
      },
    ],
    [],
  );
};
