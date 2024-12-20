import {Button, Form, Input, Modal} from "antd";
import {useAppDispatch} from "@/redux/hooks.ts";
import {requestForgotPassword} from "@/redux/features/authSlice.ts";

export const ModalForgotPassword = (props: any) => {
  const {handleClose, isOpen} = props;
  const dispatch = useAppDispatch();
  return (
      <Modal
          title={"FORGOT PASSWORD"}
          open={isOpen}
          onOk={() => {}}
          onCancel={handleClose}
          footer={[]}
          className="text-xl"
          width={700}
      >
      <Form
          onFinish={(dt) => {
            dispatch(requestForgotPassword(dt.email));
          }}
      >
        <Form.Item
            name="email"
            label="Email:"
            rules={[{ required: true, message: 'Please enter email' }]}
        >
          <Input
              allowClear
              placeholder={"Enter email"}
          />
        </Form.Item>
        <Form.Item>
          <Button
              htmlType="submit"
              className="w-full h-10 uppercase text-white text-md rounded-md bg-blue-400 mt-4"
          >
            Send email
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
