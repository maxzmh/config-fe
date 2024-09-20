import TrimInput from '@/components/Trim/TrimInput';
import {
  useSearchFieldType,
  useUserGroups,
} from '@/pages/Home/components/CreateField/hooks';
import {
  fieldControllerCreateType,
  fieldControllerUpdateType,
} from '@/services/configure/field';
import { isNil } from '@/utils/format';
import { useRequest } from 'ahooks';
import { Form, message, Modal, Select } from 'antd';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

export enum DrawerType {
  create = '新建字段',
  edit = '编辑字段',
}

export type payloadType = { type: DrawerType; data: Record<string, any> };

export type refType = {
  close: () => void;
  open: (payload: payloadType) => void;
};

const defaultPayLoad = {
  type: DrawerType.create,
  data: {},
};

export default forwardRef<refType, any>((props, ref) => {
  const { onSuccess } = props;
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<payloadType>(defaultPayLoad);
  const [form] = Form.useForm();

  const fieldTypeProps = useSearchFieldType();

  const userGroupsProps = useUserGroups();

  const { loading, runAsync } = useRequest(
    payload.type === DrawerType.create
      ? fieldControllerCreateType
      : fieldControllerUpdateType,
    {
      manual: true,
    },
  );

  const handleOpen = useCallback(
    (payload: payloadType) => {
      if (payload.type === DrawerType.edit) {
        form.setFieldsValue(payload?.data || {});
      }
      setPayload(payload);
      setOpen(true);
    },
    [setPayload, setOpen, form],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
    setPayload(defaultPayLoad);
  }, [form, setPayload, setOpen]);

  const handleSave = useCallback(async () => {
    const values = await form.validateFields();
    let res;
    if (!isNil(values?.id)) {
      // 编辑
      res = await runAsync({ id: values.id }, values);
    } else {
      // 新建
      res = await runAsync(values);
    }
    if (res.code === 200) {
      onSuccess?.();
      message.success('操作成功');
      handleClose();
    } else {
      message.error(res?.message ?? '操作失败');
    }
  }, [onSuccess, handleClose, runAsync, form]);

  useImperativeHandle(
    ref,
    (): refType => ({
      open: handleOpen,
      close: handleClose,
    }),
  );

  return (
    <Modal
      title={payload.type}
      width={660}
      open={open}
      onCancel={handleClose}
      onOk={handleSave}
      okButtonProps={{ loading }}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 5 }}>
        <Form.Item label="ID" name="id" hidden>
          <TrimInput />
        </Form.Item>
        <Form.Item label="字段名称" name="cnName" rules={[{ required: true }]}>
          <TrimInput placeholder="请输入字段名称" />
        </Form.Item>
        <Form.Item label="字段值" name="key" rules={[{ required: true }]}>
          <TrimInput placeholder="请输入字段值" />
        </Form.Item>
        <Form.Item
          label="字段类型"
          name="fieldType"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            placeholder="请选择字段类型"
            {...fieldTypeProps}
            filterOption={false}
          />
        </Form.Item>
        <Form.Item
          label="所属分组"
          name="groupIds"
          rules={[{ required: true }]}
        >
          <Select
            filterOption={false}
            mode="multiple"
            {...userGroupsProps}
            placeholder="请选择所属分组"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
