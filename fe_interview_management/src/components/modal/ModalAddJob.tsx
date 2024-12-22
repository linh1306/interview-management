// @ts-nocheck
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { JobLevel, JobStatus, UserDepartment } from "@/configs/constants.tsx";
import { Skill } from "@/interfaces/job.interface.ts";
import { createJob, getJobs, updateJob } from "@/redux/features/jobSlice.ts";
import moment from "moment";
const statusOptions = Object.entries(JobStatus).map(([key, value]) => ({ label: value, value: key }));
const jobLevelOptions = Object.entries(JobLevel).map(([key, value]) => ({ label: value, value: key }));
export const ModalAddJob = (props: any) => {
  const { initialValues, handleClose, isOpen } = props;
  const dispatch = useAppDispatch();
  const skills = useAppSelector((state) => state.job.skills);
  const benefits = useAppSelector((state) => state.job.benefits);
  const skillsOptions = skills.map((skill: Skill) => ({ label: skill.name, value: skill.id }));
  const benefitsOptions = benefits.map((benefit) => ({ label: benefit.name, value: benefit.id }));
  const departmentOptions = Object.entries(UserDepartment).map(([key, value]) => ({ label: value, value: key }));
  const [form] = Form.useForm();
  const selectAfter = (
    <Select style={{ width: 60 }} options={[{
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

    </Select>
  );
  return (
    <Modal
      title={initialValues ? "EDIT JOB" : "ADD JOB"}
      open={isOpen}
      onOk={() => { form.resetFields(); }}
      onCancel={() => {
        form.resetFields(); // Reset form khi đóng modal
        handleClose();
      }}

      footer={[]}
      className="text-xl"
      width={900}
      key={initialValues}
    >
      <Form
        form={form}
        name="layout-multiple-horizontal"
        layout="horizontal"
        className="w-full mt-10"
        onFinish={async (data) => {
          const skills = data.skills.map(it => it.value || it);
          const payload = { ...data, start_date: data.start_date.format("YYYY-MM-DD"), end_date: data.end_date.format("YYYY-MM-DD"), skills };

          if (initialValues) {
            await dispatch(updateJob({ payload, id: initialValues.id }));
          } else {
            await dispatch(createJob(payload));
          }
          await dispatch(getJobs());
          form.resetFields();
          handleClose();
        }}
        initialValues={{ ...initialValues, currency: initialValues?.currency ? initialValues?.currency : 'USD' }}
        labelCol={{ span: 6 }}
        key={initialValues}
      >
        <div className="w-full flex justify-between">
          <Form.Item
            name="title"
            label="Job title:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter job title' }]}
          >
            <Input
              allowClear
              placeholder={"Enter job title"}
            />
          </Form.Item>
          <Form.Item
            name="skills"
            label="Skill:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter skill' }]}
          >
            <Select
              data-testid="select-job-skills"
              mode="tags"
            />
          </Form.Item>
        </div>

        <div className="w-full flex justify-between">
          <Form.Item
            name="start_date"
            label="Start date:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter start date' }]}
          >
            <DatePicker
              data-testid="date-job-start"
              className="w-full"
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="End date:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter end date', }]}
          >
            <DatePicker
              data-testid="date-job-end"
              className="w-full"
              disabledDate={(current) => current && current < moment().startOf('day')}
              renderExtraFooter={() => (
                <input
                  data-testid="date-job-end-input"
                  type="hidden"
                />
              )}
            />
          </Form.Item>
        </div>

        <div className="w-full flex justify-between">
          <Form.Item
            name="salary_from"
            label="Salary from"
            className="w-1/2 mr-5"
          >
            <InputNumber
              data-testid="input-salary-from"
              addonAfter={
                <Form.Item name="currency" noStyle>
                  {selectAfter}
                </Form.Item>
              }
              step={100}
              className="w-full"
              placeholder={"Enter salary from"}
            />
          </Form.Item>
          <Form.Item
            name="salary_to"
            label="Salary to"
            className="w-1/2"
          >
            <InputNumber
              className="w-full"
              step={100}
              addonAfter={
                <Form.Item name="currency" noStyle>
                  {selectAfter}
                </Form.Item>
              }
              placeholder={"Enter salary to"}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="benefits"
            label="Benefit:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select
              data-testid="select-job-benefits"
              options={benefitsOptions}
              mode='tags'
            />
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            className="w-1/2"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <Select
              options={jobLevelOptions}
              mode='multiple'
            />
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
            name="working_address"
            label="Address"
            className="w-1/2"
          >
            <Input />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="department"
            label="Department"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <Select options={departmentOptions} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            className="w-1/2"
          >
            <Input />
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
  );
}
