import { fieldControllerCreateType } from '@/services/configure/field';
import { useRequest } from 'ahooks';
import { Form, Input, message, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

export enum DrawerType {
  create = '新建字段类型',
  edit = '编辑字段类型',
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
  const { onSucess } = props;
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<payloadType>(defaultPayLoad);
  const [form] = Form.useForm();
  const { loading, runAsync } = useRequest(fieldControllerCreateType, {
    manual: true,
  });
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
    const res = await runAsync(values);
    if (res.code === 200) {
      onSucess?.();
      message.success('操作成功');
      handleClose();
    } else {
      message.error(res?.message ?? '操作失败');
    }
  }, [onSucess, handleClose, runAsync, form]);

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
      width={600}
      open={open}
      onCancel={handleClose}
      onOk={handleSave}
      okButtonProps={{ loading }}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 4 }}>
        <Form.Item label="字段名称" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="字段值" name="type" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="附加项" name="options">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
});
