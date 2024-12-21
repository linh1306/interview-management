import { DatePicker, Form, Input, Modal, Select, TimePicker } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { useMemo } from "react";
import { InterviewStatus, OfferPosition } from "@/configs/constants.tsx";
import { createInterview, getInterviews, updateInterview } from "@/redux/features/interviewSlice.ts";
import moment from "moment";

export const ModalAddInterview = (props: any) => {
  const { initialValues, handleClose, isOpen } = props;
  const jobs = useAppSelector((state) => state.job.jobs);
  const candidates = useAppSelector((state) => state.candidate.candidates);
  const users = useAppSelector((state) => state.user.users);
  const userOptions = useMemo(() => users?.filter(it => it.role !== "HR").map((user) => ({ label: user.username, value: user.id })), [users]);
  // const candidateOptions = useMemo(() => candidates?.filter(it => it.status === 'Open').map((candidate) => ({ label: candidate.full_name, value: candidate.id })), [candidates]);
  const candidateOptions = useMemo(() => candidates?.map((candidate) => ({
    label: `${candidate.full_name} (${candidate.email})`,
    value: candidate.id
  })), [candidates]);



  const jobOptions = useMemo(() => jobs.map((job) => ({ label: job.title, value: job.id })), [jobs]);
  const positionOptions = OfferPosition.map((position) => ({ label: position, value: position }));
  const statusOptions = Object.values(InterviewStatus).map((status) => ({ label: status, value: status }));
  const dispatch = useAppDispatch();
  console.log(initialValues);
  return (
    <Modal
      title={initialValues ? "EDIT INTERVIEW SCHEDULE" : "ADD INTERVIEW SCHEDULE"}
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
          const payload = { ...data, candidate_id: data.candidate_id.value || data.candidate_id, job_id: data.job_id.value || data.job_id, interviewer_ids: data.interviewer_ids.map((it: any) => it.value || it) };
          if (initialValues) {
            await dispatch(updateInterview({ payload: payload, id: initialValues.id }));
          } else {
            await dispatch(createInterview(payload));
          }
          await dispatch(getInterviews({}));
          handleClose();
        }}
        initialValues={initialValues}
        labelCol={{ span: 6 }}
        key={initialValues}
      >
        <div className="w-full flex justify-between">
          <Form.Item
            name="title"
            label="Schedule:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter schedule title' }]}
          >
            <Input
              allowClear
              placeholder={"Enter schedule title"}
            />
          </Form.Item>
          <Form.Item
            name="job_id"
            label="Job title:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter job' }]}
          >
            <Select
              options={jobOptions}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="candidate_id"
            label="Candidate:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter candidate name' }]}
          >
            <Select
              options={candidateOptions}
              placeholder="Select candidate"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent="No candidate found"
            />
          </Form.Item>
          <Form.Item
            name="position"
            label="Position:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Select
              options={positionOptions}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="interviewer_ids"
            label="Interviewers:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter interviews' }]}
          >
            <Select options={userOptions} mode="multiple" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter status' }]}
          >
            <Select
              options={statusOptions}
            />
          </Form.Item>
        </div>
        <Form.Item
          name="schedule_date"
          label="Date:"
          labelCol={{ span: 3 }}
          rules={[{ required: true, message: 'Please enter date' }]}
        >
          <DatePicker
            className="w-full"
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>
        <div className="w-full flex justify-between">
          <Form.Item
            name="schedule_time_to"
            label="From:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter time' }]}
          >
            <TimePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="schedule_time_from"
            label="To:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter time' }]}
          >
            <TimePicker className="w-full" />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="location"
            label="Location:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input
              allowClear
              placeholder={"Enter location"}
            />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note:"
            className="w-1/2"
          >
            <Input
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
