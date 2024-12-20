// @ts-nocheck
import { DatePicker, Form, Input, Modal, Select } from "antd";
import { useAppDispatch } from "@/redux/hooks.ts";
import { createUser, getUsers, updateUser } from "@/redux/features/userSlice.ts";
import { Gender, UserDepartment, UserRole, UserStatus } from "@/configs/constants.tsx";
import TextArea from "antd/es/input/TextArea";
import moment from "moment/moment";
const genderOptions = Object.entries(Gender).map(([key, value]) => ({ label: value, value: value }));
const departmentOptions = Object.entries(UserDepartment).map(([key, value]) => ({ label: value, value: value }));
const statusOptions = Object.entries(UserStatus).map(([key, value]) => ({ label: value, value: value }));
const roleOptions = Object.entries(UserRole).map(([key, value]) => ({ label: value, value: value }));
export const ModalAddUser = (props: any) => {
  const { initialValues, handleClose, isOpen } = props;
  const dispatch = useAppDispatch();
  console.log(initialValues);
  return (
    <Modal
      title={initialValues ? "EDIT USER" : "ADD USER"}
      open={isOpen}
      onOk={() => { }}
      onCancel={handleClose}
      footer={[]}
      className="text-xl"
      width={900}
    >
      <Form
        name="layout-multiple-horizontal"
        layout="horizontal"
        className="w-full mt-10"
        onFinish={async (data) => {
          if (initialValues) {
            const payload = { ...data, dob: data.dob.format("YYYY-MM-DD") };
            await dispatch(updateUser({ payload, id: initialValues.id }));
            handleClose();
            // @ts-ignore
            dispatch(getUsers());
          } else {
            const payload = { ...data, dob: data.dob.format("YYYY-MM-DD") };
            await dispatch(createUser(payload));
            handleClose();
          }
        }}
        initialValues={initialValues}
        labelCol={{ span: 6 }}
        key={initialValues}
      >
        <div className="w-full flex justify-between">
          <Form.Item
            name="full_name"
            label="Full name:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input
              allowClear
              placeholder={"Enter full name"}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter email' }]}
          >
            <Input
              allowClear
              placeholder={"Enter email"}
            />
          </Form.Item>
        </div>

        <div className="w-full flex justify-between">
          <Form.Item
            name="phone"
            label="Phone:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter phone' }]}
          >
            <Input
              allowClear
              placeholder={"Enter phone"}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter role' }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
        </div>

        <div className="w-full flex justify-between">
          <Form.Item
            name="dob"
            label="Date of Birth:"
            className="w-1/2 mr-5"
          >
            <DatePicker
                className="w-full"
                disabledDate={(current) => current && current > moment().startOf('day')}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address:"
            className="w-1/2"
          >
            <Input
              allowClear
              placeholder={"Enter address"}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="gender"
            label="Gender"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select options={genderOptions} />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            className="w-1/2"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <Select options={departmentOptions} />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="status"
            label="Status"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            className="w-1/2"
          >
            <Input />
          </Form.Item>
        </div>
        <Form.Item
            name="note"
            label="Note"
            className="w-full"
            labelCol={{ span: 3 }}
        >
          <TextArea
              allowClear
              placeholder={"Enter note"}
          />
        </Form.Item>
        <div className="w-full flex justify-end gap-x-5 mt-5">
          <Form.Item>
            <button
              className="border-blue-500 border px-4 py-2 text-blue-500 rounded"
              onClick={handleClose}
              type="button"
            >
              Close
            </button>
          </Form.Item>
          <Form.Item>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-5 rounded disabled:bg-gray-300 disabled:text-gray-500"
              type="submit"
            >
              Submit
            </button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
