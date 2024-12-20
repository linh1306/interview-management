import Helmet from "@/components/Helmet.tsx";
import { Button, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GenericTable from "@/components/Table";
import { useEffect, useState } from "react";
import { ModalAddRequest } from "@/components/modal/ModalAddRequest.tsx";
import { useAppDispatch, useAppSelector, useAuth } from "@/redux/hooks.ts";
import moment from "moment";
import dayjs from "dayjs";

// Constants for select options
const RequestStatus = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
};

const LevelOptions = [
    'Fresher',
    'Junior',
    'Senior',
    'Lead',
    'Manager'
];

const WorkplaceOptions = [
    'Ha Noi',
    'Hai Phong',
    'Ho Chi Minh',
    'Da Nang'
];

const columns = [
    {
        title: 'Request ID',
        dataIndex: 'request_id',
        key: 'request_id',
    },
    {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
    },
    {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        render: (levels: string[]) => levels.join(', ')
    },
    {
        title: 'Workplace',
        dataIndex: 'workplace',
        key: 'workplace',
    },
    {
        title: 'Recruitment Period',
        key: 'recruitment_period',
        render: (record: any) => (
            `${moment(record.start_date).format('DD/MM/YYYY')} - 
             ${moment(record.end_date).format('DD/MM/YYYY')}`
        )
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    }
];

export const RequestPage = () => {
    const [selectedStatus, setSelectedStatus] = useState<any>(undefined);
    const [selectedRequest, setSelectedRequest] = useState<any>(undefined);
    const dispatch = useAppDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const requests = useAppSelector((state) => state.request?.requests || []);
    const { role, user } = useAuth();

    const statusOptions = Object.entries(RequestStatus).map(([key, value]) => ({
        label: value,
        value: value
    }));

    useEffect(() => {
        // You'll need to create and dispatch a getRequests action
        // dispatch(getRequests({}));
    }, [selectedStatus]);

    const handleClose = () => {
        setSelectedRequest(undefined);
        setIsModalVisible(false);
    }

    // Function to generate Request ID
    const generateRequestId = (workplace: string, position: string, currentCount: number) => {
        const prefix = workplace.split(' ').map(word => word[0]).join('');
        const formattedCount = String(currentCount).padStart(2, '0');
        return `${prefix}-${position}-${formattedCount}`;
    };

    const handleCreateRequest = (values: any) => {
        // Get current count of requests for this position and workplace
        const currentCount = requests.filter(
            (req: any) =>
                req.position === values.position &&
                req.workplace === values.workplace
        ).length + 1;

        const requestData = {
            ...values,
            request_id: generateRequestId(values.workplace, values.position, currentCount),
            department: user?.department, // Default to user's department
            created_by: user?.id,
            created_date: new Date(),
            status: RequestStatus.PENDING
        };

        // dispatch(createRequest(requestData));
    };

    return (
        <div className="p-10 bg-white h-full rounded">
            <Helmet title="Manage Recruitment Requests" />
            {/* You'll need to create a ModalAddRequest component with the specified fields */}
            <ModalAddRequest
                isOpen={isModalVisible}
                handleClose={handleClose}
                initialValues={selectedRequest}
                key={selectedRequest}
            />
            <div className="w-full flex justify-between items-center">
                <div className="flex w-9/12">
                    <Select
                        className="w-1/6 mr-2"
                        placeholder="Select status"
                        options={statusOptions}
                        onChange={(value) => setSelectedStatus(value)}
                        size="large"
                        defaultValue={selectedStatus}
                        allowClear
                    />
                    <Input.Search
                        className="w-1/3"
                        placeholder="Search by position or ID"
                        onSearch={async (search) => {
                            // dispatch(getRequests({ filter: JSON.stringify({ status: selectedStatus }), search }));
                        }}
                        size="large"
                    />
                </div>
                <Button
                    className="bg-blue-500 text-white p-5 rounded-lg"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    New Recruitment Request
                </Button>
            </div>
            <div className="mt-5">
                <GenericTable
                    columns={columns}
                    data={requests}
                    onDeleteItem={async (record) => {
                        // await dispatch(deleteRequest(record.id));
                        // await dispatch(getRequests({}));
                    }}
                    onEditItem={(record) => {
                        setSelectedRequest({
                            ...record,
                            start_date: dayjs(record.start_date),
                            end_date: dayjs(record.end_date)
                        });
                        setIsModalVisible(true);
                    }}
                />
            </div>
        </div>
    )
}

export default RequestPage;