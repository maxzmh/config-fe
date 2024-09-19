import PProTable from '@/components/PProTable';
import CreateFieldType, {
  DrawerType,
  refType,
} from '@/pages/Home/components/CreateFieldType';
import { fieldControllerFindTypes } from '@/services/configure/field';
import { Button, Space } from 'antd';
import { useRef } from 'react';
import { useColumns } from './hooks';

export default function FieldType() {
  const columns = useColumns();
  const modalRef = useRef<refType>(null);
  return (
    <>
      <PProTable
        toolBarRender={() => (
          <Space>
            <Button
              type="primary"
              onClick={() =>
                modalRef.current.open({
                  type: DrawerType.create,
                  data: {},
                })
              }
            >
              新建
            </Button>
          </Space>
        )}
        columns={columns}
        request={fieldControllerFindTypes}
        rowKey="id"
      />
      <CreateFieldType ref={modalRef} />
    </>
  );
}
