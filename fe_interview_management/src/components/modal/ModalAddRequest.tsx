// @ts-nocheck
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import { UserDepartment } from "@/configs/constants.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import moment from "moment";
import { UserRole } from "@/configs/constants.tsx";
import { createRequest, getRequests, updateRequest } from "@/redux/features/requestSlice.ts";
import { notification } from "antd";
import { useState, useEffect } from "react";
import { OfferPositionByDepartment } from '@/configs/constants.tsx';
const { RangePicker } = DatePicker;

const LevelOptions = [
    'Junior',
    'Middle',
    'Senior',
];

const WorkplaceOptions = [
    'Ha Noi',
    'Hai Phong',
    'Ho Chi Minh',
    'Da Nang'
];

const DepartmentOptions = Object.values(UserDepartment);


export const ModalAddRequest = (props: any) => {
    const { initialValues, handleClose, isOpen } = props;
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.currentUser);

    const [form] = Form.useForm();
    const [department, setDepartment] = useState(null);
    const [positionOptionsByDept, setPositionOptionsByDept] = useState<any[]>([]);

    const levelOptions = LevelOptions.map(level => ({ label: level, value: level }));
    const workplaceOptions = WorkplaceOptions.map(place => ({ label: place, value: place }));

    const handleDepartmentChange = (val) => {
        setDepartment(val);
        form.setFieldValue('position', undefined);
        const positions = OfferPositionByDepartment[val] || [];
        setPositionOptionsByDept(positions);
        console.log('positions after change:', positions);
    };

    useEffect(() => {
        if (department) {
            const positions = OfferPositionByDepartment[department] || [];
            // setPositionOptionsByDept(OfferPositionByDepartment[department] || []);
            setPositionOptionsByDept(positions);
            form.validateFields(['position']);
        } else {
            setPositionOptionsByDept([]);
            form.setFieldValue('position', undefined);
        }
    }, [department]);

    useEffect(() => {
        // Nếu là Manager, set department ngay từ đầu là department của user
        if (user?.role === UserRole.Manager) {
            setDepartment(user.department);
            setPositionOptionsByDept(OfferPositionByDepartment[user.department] || []);
        }
    }, [user]);


    useEffect(() => {
        // Set initial department if editing
        if (initialValues?.department) {
            setDepartment(initialValues.department);
        }
    }, [initialValues]);


    return (
        <Modal
            title={initialValues ? "EDIT RECRUITMENT REQUEST" : "NEW RECRUITMENT REQUEST"}
            open={isOpen}
            onOk={() => { }}
            onCancel={handleClose}
            footer={[]}
            className="text-xl"
            width={1000}
            key={initialValues}
        >
            <Form
                name="recruitment-request-form"
                layout="horizontal"
                className="w-full mt-10"
                onFinish={async (data) => {
                    const payload = {
                        ...data,
                        // department: user?.department, // Auto-set to user's department
                        department: user?.role === UserRole.Admin ? data.department : user?.department,
                        start_date: data.recruitment_period[0].format("YYYY-MM-DD"),
                        end_date: data.recruitment_period[1].format("YYYY-MM-DD"),
                        status: 'Pending'
                    };
                    delete payload.recruitment_period;
                    try {
                        if (initialValues) {
                            await dispatch(updateRequest({ payload, id: initialValues.id }));
                        } else {
                            await dispatch(createRequest(payload));
                        }
                        await dispatch(getRequests({}));

                        notification.success({
                            message: 'Success',
                            description: 'Action Done.',
                        });

                        handleClose();
                    } catch (error) {
                        // Thông báo lỗi nếu có
                        notification.error({
                            message: 'Error',
                            description: 'Action Fail.',
                        });
                    }

                }}
                initialValues={initialValues ? {
                    ...initialValues,
                    recruitment_period: [
                        moment(initialValues.start_date),
                        moment(initialValues.end_date)
                    ]
                } : {}}
                labelCol={{ span: 6 }}
            >
                <h3 className="font-semibold mb-5">Recruitment Request Information</h3>
                <div className="w-full flex justify-between">
                    <Form.Item
                        name="department"
                        label="Department:"
                        className="w-1/2"
                        rules={user?.role === UserRole.Admin ? [{ required: true, message: 'Please select department' }] : []}
                    >
                        {user?.role === UserRole.Admin ? (
                            <Select
                                options={DepartmentOptions.map(dept => ({ label: dept, value: dept }))}
                                placeholder="Select department"
                                onChange={handleDepartmentChange}
                            />
                        ) : (
                            <Input
                                disabled
                                value={user?.department}
                                placeholder={user?.department}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        name="position"
                        label="Position:"
                        className="w-1/2 mr-5"
                        validateTrigger="onBlur"
                        rules={[
                            { required: true, message: 'Please select a position' },
                            ...(user?.role === UserRole.Admin || user?.role === UserRole.HR ? [{
                                validator(_, value) {
                                    if (!department) {
                                        return Promise.reject(new Error('Please choose the department first'));
                                    }
                                    return Promise.resolve();
                                },
                            }] : []),
                        ]}
                    >
                        <Select
                            data-testid="select-request-position"
                            options={positionOptionsByDept}

                            disabled={!department}
                            placeholder={department ? "Select position" : "Please select department first"}

                        />
                    </Form.Item>

                </div>

                <div className="w-full flex justify-between">
                    <Form.Item
                        name="quantity"
                        label="Quantity:"
                        className="w-1/2"
                        rules={[{ required: true, message: 'Please enter quantity' }]}
                    >
                        <InputNumber
                            min={1}
                            className="w-full"
                            placeholder="Enter number of positions"
                        />
                    </Form.Item>
                    <Form.Item
                        name="recruitment_period"
                        label="Period:"
                        className="w-1/2 mr-5"
                        rules={[{ required: true, message: 'Please select recruitment period' }]}
                    >
                        <RangePicker
                            className="w-full"
                            format="DD/MM/YYYY"
                            disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                    </Form.Item>

                </div>

                <div className="w-full flex justify-between">
                    <Form.Item
                        name="workplace"
                        label="Workplace:"
                        className="w-1/2"
                        rules={[{ required: true, message: 'Please select workplace' }]}
                    >
                        <Select
                            data-testid="select-request-workplace"
                            options={workplaceOptions}
                            placeholder="Select workplace"
                        />
                    </Form.Item>
                    <Form.Item
                        name="level"
                        label="Level:"
                        className="w-1/2 mr-5"
                        rules={[{ required: true, message: 'Please select level(s)' }]}
                    >
                        <Select
                            mode="multiple"
                            options={levelOptions}
                            placeholder="Select required levels"
                        />
                    </Form.Item>

                </div>

                <Form.Item
                    name="description"
                    label="Description:"
                    labelCol={{ span: 3 }}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter request description (optional)"
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
};