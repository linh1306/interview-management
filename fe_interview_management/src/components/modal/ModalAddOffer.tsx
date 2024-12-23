// @ts-nocheck
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { useEffect, useMemo, useState } from "react";
import { OfferLevel, OfferPosition, OfferStatus, OfferType, UserDepartment } from "@/configs/constants.tsx";
import { createOffer, getOffers, updateOffer } from "@/redux/features/offerSlice.ts";
import { useAuth } from "@/redux/hooks.ts";
import moment from "moment";

export const ModalAddOffer = (props: any) => {
  const { initialValues, handleClose, isOpen } = props;
  const interviews = useAppSelector((state) => state.interview.interviews);
  const candidates = useAppSelector((state) => state.candidate.candidates);
  const users = useAppSelector((state) => state.user.users);
  const userOptions = useMemo(() => users.map((user) => ({ label: user.username, value: user.id })), [users]);
  const candidateOptions = useMemo(() => candidates.map((candidate) => ({ label: candidate.full_name, value: candidate.id })), [candidates]);
  const positionOptions = OfferPosition.map((position) => ({ label: position, value: position }));
  const statusOptions = Object.values(OfferStatus).map((status) => ({ label: status, value: status }));
  const interviewOptions = useMemo(() => interviews.map((interview) => ({ label: interview.title, value: interview.id })), [interviews]);
  const levelOptions = Object.entries(OfferLevel).map(([key, value]) => ({ label: value, value: value }));
  const { user } = useAuth();
  const departmentOptions = useMemo(() => {
    if (user?.role === 'Manager') {
      // Nếu là Manager chỉ hiện phòng ban của họ
      return [{ label: user.department, value: user.department }];
    }
    // Nếu không phải Manager thì hiện tất cả phòng ban
    return Object.entries(UserDepartment).map(([key, value]) => ({
      label: value,
      value: value
    }));
  }, [user]);

  const offerTypeOptions = Object.entries(OfferType).map(([key, value]) => ({ label: value, value: value }));
  const dispatch = useAppDispatch();
  const [selectedInterview, setSelectedInterview] = useState<any>(undefined);
  const approverOptions = useMemo(() => {
    const hrUsers = users.filter(u => u.role === 'HR');

    // Chỉ hiện current user và HR users
    return [
      { label: user.username, value: user.id },
      ...hrUsers.map(hrUser => ({
        label: hrUser.username,
        value: hrUser.id
      }))
    ];
  }, [users, user]);

  useEffect(() => {
    console.log(selectedInterview);
  }, [selectedInterview]);
  return (
    console.log('departmentOptions: ', departmentOptions),
    <Modal
      title={initialValues ? "EDIT OFFER" : "ADD OFFER"}
      open={isOpen}
      onOk={() => { }}
      onCancel={handleClose}
      footer={[]}
      className="text-xl"
      width={1000}
      key={initialValues}
    >
      <Form
        name="layout-multiple-horizontal"
        layout="horizontal"
        className="w-full mt-10"
        onFinish={async (data) => {
          const payload = { ...data, candidate_id: data.candidate_id.value || data.candidate_id, interview_schedule_id: data.interview_schedule_id.value || data.interview_schedule_id, manager_id: data.manager_id.value || data.manager_id };
          if (initialValues) {
            await dispatch(updateOffer({ payload, id: initialValues.id }));
          } else {
            delete payload.status;
            await dispatch(createOffer(payload));
          }
          await dispatch(getOffers({}));
          handleClose();
        }}
        initialValues={initialValues || { currency: 'USD' }}
        labelCol={{ span: 6 }}
        key={initialValues}
      >
        <div className="w-full flex justify-between">
          <Form.Item
            name="candidate_id"
            label="Candidate:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter candidate name' }]}
          >
            <Select
              data-testid="select-offer-candidate"
              options={candidateOptions}
            />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter department' }]}
          >
            <Select
              data-testid="select-offer-department"
              options={departmentOptions}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="interview_schedule_id"
            label="Interview:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter job' }]}
          >
            <Select
              data-testid="select-offer-interview"
              options={interviewOptions}
              onChange={(value) => {
                setSelectedInterview(interviews.find((it) => it.id === value));
              }}
            />
          </Form.Item>
          <Form.Item
            name="position"
            label="Position:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Select
              data-testid="select-offer-position"
              options={positionOptions}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="manager_id"
            label="Approved by:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter approver' }]}
          >
            <Select
              data-testid="select-offer-approver"
              options={approverOptions}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter status' }]}
          >
            <Select
              data-testid="select-offer-status"
              options={statusOptions}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="level"
            label="Level:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter level' }]}
          >
            <Select
              data-testid="select-offer-level"
              options={levelOptions} />
          </Form.Item>
          <Form.Item
            name="contract_type"
            label="Type:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter type' }]}
          >
            <Select
              data-testid="select-offer-contract"
              options={offerTypeOptions} />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="contract_from"
            label="Contract From:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter time' }]}
          >
            <DatePicker
              data-testid="select-offer-from"
              className="w-full"
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>
          <Form.Item
            name="contract_to"
            label="Contract To:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter time' }]}
          >
            <DatePicker
              data-testid="select-offer-to"
              className="w-full"
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="basic_salary"
            label="Basic Salary:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter salary' }]}
          >
            <InputNumber
              data-testid="input-offer-salary"
              addonAfter={
                <Form.Item name="currency" noStyle>
                  {<Select style={{ width: 60 }} options={[{
                    value: 'USD',
                    label: '$'
                  },
                  {
                    value: 'EUR',
                    label: '€'
                  },
                  {
                    value: 'GBP',
                    label: '£'
                  },
                  {
                    value: 'CNY',
                    label: '¥'
                  }]}>
                  </Select>}
                </Form.Item>
              }
              step={100}
              className="w-full"
              placeholder={"Enter salary from"}
            />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note:"
            className="w-1/2"
          >
            <Input
              data-testid="input-offer-note"
              allowClear
              placeholder={"Enter note"}
            />
          </Form.Item>
        </div>
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
  )
}
