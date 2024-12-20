// @ts-nocheck
import { Modal, Space, TableProps } from "antd";
import Search from "antd/es/input/Search";
import GenericTable from "@/components/Table";
import React from "react";
import { Device } from "@/interfaces";

const columns: TableProps<Device>['columns'] = [
  {
    title: "Mã thiết bị",
    dataIndex: "id",
    key: "id"
  },
  {
    title: 'Tên thiết bị',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Loại thiết bị',
    dataIndex: 'deviceType',
    key: 'deviceType',
  },
  {
    title: 'Môn học',
    dataIndex: 'subject',
    key: 'subject',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
  }
];

const ModalDeviceList = (props) => {
  const { data, isOpen, handleClose, handleSelection } = props;
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const onSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
  }
  return (
    <Modal
      title="Danh sách thiết bị"
      open={isOpen}
      onOk={() => { }}
      onCancel={handleClose}
      footer={[]}
      className="text-xl"
      width={900}
    >
      <Search placeholder="Tìm kiếm tên thiết bị" onSearch={() => { }} style={{ width: 200 }} />
      <GenericTable
        columns={columns}
        data={data}
        enableSelection={true}
        enableAction={false}
        pagination={{ pageSize: 5, pageSizeOptions: ['5', '10', '15', '20'] }}
        onSelectionChange={onSelectionChange}
      />
      <div className="w-full flex justify-end gap-x-5">
        <button
          className="border-blue-500 border px-4 text-blue-500 rounded"
          onClick={handleClose}
        >
          Đóng
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-5 rounded"
          type="submit"
          onClick={() => handleSelection(selectedRowKeys)}
        >
          Chọn
        </button>
      </div>
    </Modal>
  );
}

export default ModalDeviceList;
