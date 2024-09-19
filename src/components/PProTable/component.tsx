import { ProTable, ProTableProps } from '@ant-design/pro-components';

export const withTransformProTableReq = <C extends React.ComponentType<any>>(
  Component: C,
) => {
  return (props: ProTableProps<any, any>) => {
    const { request } = props;
    const handleRequest = async (params, ...rest) => {
      const { current, pageSize } = params;
      delete params.current;
      delete params.pageSize;
      const _params = { ...params, page: current, limit: pageSize };
      const res = await request(_params, ...rest);
      return (
        res?.data || {
          data: [],
          total: 0,
        }
      );
    };
    return <Component {...props} request={handleRequest} />;
  };
};

export default withTransformProTableReq(ProTable);
