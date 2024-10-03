'use client';

import React, { useState } from 'react';
import { Divider, Radio, Table, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// interface DataType {
//   key: React.Key;
//   name: string;
//   age: number;
//   address: string;
// }

// const columns: TableColumnsType<DataType> = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     render: (text: string) => <a>{text}</a>,
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//   },
// ];

// const data: DataType[] = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//   },
//   {
//     key: '4',
//     name: 'Disabled User',
//     age: 99,
//     address: 'Sydney No. 1 Lake Park',
//   },
// ];

// // rowSelection object indicates the need for row selection
// const rowSelection: TableProps<DataType>['rowSelection'] = {
//   onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   getCheckboxProps: (record: DataType) => ({
//     disabled: record.name === 'Disabled User', // Column configuration not to be checked
//     name: record.name,
//   }),
// };

const App: React.FC = () => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');

  return (
    <div>
        <h1 style={{ fontSize: 30, padding: 20}} >Project
            <Button type='primary' style={{ marginLeft: 823 }}>
                <PlusOutlined />Tambah
            </Button>
        </h1>
        <div style={{ padding: 24, minHeight: '100vh', backgroundColor: '#FFFFFF', borderRadius: 15 }}>
            {/* <Radio.Group onChange={(e) => setSelectionType(e.target.value)} value={selectionType}>
                <Radio value="checkbox">Checkbox</Radio>
                <Radio value="radio">radio</Radio>
            </Radio.Group>
            <Divider />
            <Table<DataType>
                rowSelection={{ type: selectionType, ...rowSelection }}
                columns={columns}
                dataSource={data}
            /> */}
        </div>
      
    </div>
  );
};

export default App;