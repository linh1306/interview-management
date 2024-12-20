// @ts-nocheck
import { DatePicker, Form, Input, InputNumber, Modal, Select, Upload, UploadProps } from "antd";
import { CandidateStatus, Gender, HighestLevelCandidate, JobStatus, OfferPosition, UserDepartment, UserRole } from "@/configs/constants.tsx";
import { DownloadOutlined, EyeOutlined, InboxOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { Skill } from "@/interfaces/job.interface.ts";
import { createCandidate, getCandidates, updateCandidate } from "@/redux/features/candidateSlice.ts";
import { useState } from "react";
import moment from "moment/moment";
const genderOptions = Object.entries(Gender).map(([key, value]) => ({ label: value, value: key }));
const { Dragger } = Upload;
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};
export const ModalAddCandidate = (props: any) => {
  const { initialValues, handleClose, isOpen } = props;
  const dispatch = useAppDispatch();
  const skills = useAppSelector((state) => state.job.skills);
  const skillsOptions = skills.map((skill: Skill) => ({ label: skill.name, value: skill.id }));
  const highestLevelOptions = HighestLevelCandidate.map((level) => ({ label: level, value: level }));
  const statusOptions = Object.entries(CandidateStatus).map(([key, value]) => ({ label: value, value: value }));
  const positionOptions = OfferPosition.map((position) => ({ label: position, value: position }));
  const [fileList, setFileList] = useState<any>([]);

  const user = useAppSelector((state) => state.auth.currentUser)

  const uploadProps: UploadProps = {
    name: 'file',
    accept: ".pdf,.doc,.docx",
    customRequest: dummyRequest,
    onChange: info => {
      setFileList(info.fileList);
    }
  };

  const selectAfter = (
      <Select style={{ width: 60 }} options={[{
        value: 'Year(s)',
        label: '$'
      }
      ]}>

      </Select>
  );
  return (
    <Modal
      title={initialValues ? "EDIT CANDIDATE" : "ADD CANDIDATE"}
      open={isOpen}
      onOk={() => { }}
      onCancel={handleClose}
      footer={[]}
      className="text-xl"
      width={1250}
      key={initialValues}
    >
      <Form
        name="layout-multiple-horizontal"
        layout="horizontal"
        className="w-full mt-10"
        onFinish={async (data) => {
          const skills = data.skills.map(it => it.value || it);
          const payload = { ...data, dob: data.dob.format("YYYY-MM-DD"), file: data?.attach_file?.fileList ? data?.attach_file?.fileList[0] : undefined, skills };
          delete payload.attach_file;
          if (!payload.file) {
            delete payload.file;
          }
          const formData = new FormData();
          Object.keys(payload).forEach((key) => {
            if (Array.isArray(payload[key])) {
              payload[key].forEach((item) => {
                formData.append(key, item);
              });
            } else {
              if (key === "file" && payload[key]) {
                formData.append(key, payload[key].originFileObj);
              } else {
                formData.append(key, payload[key]);
              }
            }
          });
          if (initialValues) {
            await dispatch(updateCandidate({ payload: formData, id: initialValues.id }));
          } else {
            await dispatch(createCandidate(formData));
          }
          await dispatch(getCandidates());
          handleClose();
        }}
        initialValues={initialValues || {note: ''}}
        labelCol={{ span: 6 }}
        key={initialValues}
      >
        <h3 className="font-semibold mb-5">I. Personal information</h3>
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
              type="email"
              placeholder={"Enter email"}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="dob"
            label="D.O.B:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter dob' }]}
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
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input
              allowClear
              placeholder={"Enter address"}
            />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="phone"
            label="Phone no:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter phone no' }]}
          >
            <Input
              allowClear
              placeholder={"Enter full phone no"}
            />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            className="w-1/2"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select options={genderOptions} />
          </Form.Item>
        </div>
        <h3 className="font-semibold mb-5">II. Professional Information</h3>
        <Form.Item
          name="attach_file"
          className="w-full"
          rules={[{ required: true, message: 'Please upload CV' }]}
        >
          <Dragger {...uploadProps} maxCount={1}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single file. Type: pdf, doc, docx. Max file size: 5MB
            </p>
          </Dragger>
        </Form.Item>
        {
          initialValues && initialValues.attach_file && fileList.length === 0 &&
          <div className="mb-5 translate-y-[-10px] text-blue-400 justify-between flex w-full">
            <a href={initialValues.attach_file} target="_blank">
              &#128206;
              CV uploaded
            </a>
            <DownloadOutlined href={initialValues.attach_file} />
          </div>
        }
        <div className="w-full flex justify-between">
          <Form.Item
            name="position"
            label="Position:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Select options={positionOptions} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            className="w-1/2"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select options={statusOptions} />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="skills"
            label="Skill:"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter skill' }]}
          >
            <Select
              mode="tags"
            />
          </Form.Item>
          <Form.Item
            name="highest_level"
            label="Highest level"
            className="w-1/2"
            rules={[{ required: true, message: 'Please select highest level' }]}
          >
            <Select options={highestLevelOptions} />
          </Form.Item>
        </div>
        <div className="w-full flex justify-between">
          <Form.Item
            name="year_experience"
            label="Experience"
            className="w-1/2 mr-5"
            rules={[{ required: true, message: 'Please enter experience' }]}
          >
            <InputNumber
              className="w-full"
              placeholder={"Enter experience"}
              addonAfter={<div>Year(s)</div>}
            />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note"
            className="w-1/2"
          >
            <Input
              allowClear
              placeholder={"Enter note"}
            />
          </Form.Item>
        </div>
        {
          [UserRole.Admin, UserRole.HR].includes(user?.role) && <div className="w-full flex justify-between">
            <Form.Item
              name="department"
              label="Owner Department"
              className="w-1/2 mr-5"
              rules={[{ required: true, message: 'Please choose department' }]}
            >
              <Select
                className="w-full"
                options={Object.values(UserDepartment).map(v => ({
                  value: v,
                  label: v
                }))}
              />
            </Form.Item>

            <div className="w-1/2"></div>
          </div>
        }

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
