import { DatePicker, Form, Input, Modal, Select, TimePicker } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { useMemo } from "react";
import { InterviewStatus, OfferPosition } from "@/configs/constants.tsx";
import { createInterview, getInterviews, updateInterview } from "@/redux/features/interviewSlice.ts";
import { createCandidate, getCandidates, updateCandidate } from "@/redux/features/candidateSlice.ts";
import moment from "moment";
import { useState, useEffect } from "react";

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
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Cập nhật khi select candidate hoặc khi edit
  useEffect(() => {
    if (initialValues) {
      setSelectedCandidateId(initialValues.candidate_id);
    }
  }, [initialValues]);


  // Thêm useEffect để lọc candidates khi job thay đổi
  useEffect(() => {
    if (selectedJob) {
      const job = jobs.find(job => job.id === selectedJob);
      if (job) {
        const filtered = candidates.filter(candidate =>
          candidate.position?.toLowerCase() === job.position?.toLowerCase()
        );

        setFilteredCandidates(filtered.map(candidate => ({
          label: `${candidate.full_name} (${candidate.email})`,
          value: candidate.id
        })));
      }
    } else {
      setFilteredCandidates([]);
    }
  }, [selectedJob, candidates, jobs]);





  const jobOptions = useMemo(() => jobs.map((job) => ({ label: job.title, value: job.id })), [jobs]);
  const positionOptions = OfferPosition.map((position) => ({ label: position, value: position }));
  const statusOptions = [
    { value: 'Invited', label: 'Invited' },
    { value: 'Interviewed', label: 'Interviewed' }, // Giữ lại Interviewed
    { value: 'Cancelled', label: 'Cancelled' }
  ];



  const dispatch = useAppDispatch();
  const [showResult, setShowResult] = useState(false);
  const resultOptions = [
    { label: 'Passed', value: 'Passed' },
    { label: 'Failed', value: 'Failed' }
  ];

  // Thêm watch cho status field
  const [form] = Form.useForm();
  const candidateValue = Form.useWatch('candidate_id', form);
  const statusValue = Form.useWatch('status', form);

  useEffect(() => {
    console.log('Watched candidate_id:', candidateValue);
    console.log('Watched status:', statusValue);
  }, [candidateValue, statusValue]);

  useEffect(() => {
    const status = form.getFieldValue('status');
    setShowResult(status === 'Interviewed');
  }, [form.getFieldValue('status')]);
  const updateCandidateStatus = async (status) => {
    const candidateId = selectedCandidateId.value || initialValues?.candidate_id;
    console.log('selectedCandidateId: ', selectedCandidateId)
    console.log('initialValues?.candidate_id: ', initialValues?.candidate_id)
    if (candidateId) {
      await dispatch(updateCandidate({
        id: candidateId,
        payload: { status }
      }));
    }
  };

  console.log('candidates: ', candidates);
  console.log('jobs: ', jobs);
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
          const selectedJobData = jobs.find(job => job.id === data.job_id.value || data.job_id);
          const { result, ...rest } = data;
          const payload = {
            ...rest,
            candidate_id: data.candidate_id.value || data.candidate_id,
            job_id: data.job_id.value || data.job_id,
            interviewer_ids: data.interviewer_ids.map((it: any) => it.value || it),
            position: selectedJobData?.position,
            status: data.status === 'Interviewed' ? data.result : data.status
          };

          const status = data.status;
          if (status === 'Interviewed') {
            await updateCandidateStatus(data.result === 'Passed' ? 'Passed interview' : 'Banned');
          }

          if (initialValues) {
            await dispatch(updateInterview({ payload: payload, id: initialValues.id }));
          } else {
            await dispatch(createInterview(payload));
          }
          await dispatch(getInterviews({}));
          handleClose();
        }}
        initialValues={initialValues || { status: 'Invited' }}
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

        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="job_id"
            label="Job title:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter job' }]}
          >
            <Select
              options={jobOptions}
              data-testid="select-interview-job"
              onChange={(value) => setSelectedJob(value)}

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
              options={filteredCandidates}
              data-testid="select-interview-candidate"
              placeholder="Select candidate"
              showSearch
              onChange={(value) => setSelectedCandidateId(value)}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent="No candidate found"
            />
          </Form.Item>
          {/* <Form.Item
            name="position"
            label="Position:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Select
              data-testid="select-interview-position"
              options={positionOptions}
            />
          </Form.Item> */}
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="interviewer_ids"
            label="Interviewers:"
            // className="w-1/2 mr-5"
            className="w-1/3 mr-5"
            rules={[{ required: true, message: 'Please enter interviews' }]}
          >
            <Select
              data-testid="select-interview-interviewers"
              options={userOptions} mode="multiple" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status:"
            // className="w-1/2"
            className="w-1/3 mr-5"
            rules={[{ required: true, message: 'Please enter status' }]}
          >
            <Select
              data-testid="select-interview-status"
              options={statusOptions}
              onChange={(value) => {
                setShowResult(value === 'Interviewed');
                if (value === 'Invited') {
                  updateCandidateStatus('Waiting for interview');
                } else if (value === 'Cancelled') {
                  updateCandidateStatus('Cancelled interview');
                }
              }}


            />
          </Form.Item>
          {showResult && (
            <Form.Item
              name="result"
              label="Result:"
              className="w-1/3"
              rules={[{ required: true, message: 'Please select result' }]}
            >
              <Select
                options={resultOptions}
                onChange={(value) => {
                  // Update candidate status based on result
                  updateCandidateStatus(value === 'Passed' ? 'Passed interview' : 'Banned');
                }}
              />
            </Form.Item>
          )}
        </div>
        <Form.Item
          name="schedule_date"
          label="Date:"
          labelCol={{ span: 3 }}
          rules={[{ required: true, message: 'Please enter date' }]}
        >
          <DatePicker
            data-testid="date-interview-schedule"
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
            <TimePicker
              data-testid="time-interview-from"
              className="w-full" />
          </Form.Item>
          <Form.Item
            name="schedule_time_from"
            label="To:"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter time' }]}
          >
            <TimePicker
              data-testid="time-interview-to"
              className="w-full" />
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
