// @ts-nocheck
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAuth } from "@/redux/hooks.ts";
import { canNavigateToRoute } from "@/routes.tsx";
import { Avatar, Button, Dropdown, Form, Image, Layout, Menu, MenuProps, Modal, theme, Input } from "antd";
import {
  CarryOutFilled,
  DingtalkOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined, SearchOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { updatePassword } from "@/redux/features/authSlice.ts";

const { Header, Sider, Content } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}


function LayoutWrapper() {
  const location = useLocation();
  const { user, isAuth, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const [cr, errorMsg] = canNavigateToRoute({
      route: location.pathname,
      validUser: !!user,
      isAdmin: isAdmin,
      role: user?.role
    });

    if (errorMsg) {
      console.error(errorMsg);
      window.location.href = cr.path;
    }

    if (!isAuth && location.pathname !== '/login') {
      navigate('/login')
    }

    if (["/register", "/login"].includes(location.pathname) && isAuth) {
      navigate('/')
    }
  }, [location, user?.role]);

  const active = useMemo(() => {
    return location.pathname
  }, [location.pathname])

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // Define menu items with Link wrapped around the label
  const getMenuItems = (role: string) => {
    // Menu items cơ bản cho tất cả role
    const baseItems = [
      getItem(<Link to="/">Dashboard</Link>, '/', <HomeOutlined />),
      getItem(<Link to="/candidate">Candidate</Link>, '/candidate', <SearchOutlined />),
      getItem(<Link to="/job">Job</Link>, '/job', <CarryOutFilled />),
      getItem(<Link to="/interview">Interview</Link>, '/interview', <DingtalkOutlined />),
      // getItem(<Link to="/offer">Offer</Link>, '/offer', <SettingOutlined />),
    ];
    if (role !== 'Interviewer') {
      baseItems.push(
        getItem(<Link to="/offer">Offer</Link>, '/offer', <SettingOutlined />)
      );
    }

    // Thêm Request menu cho role được phép
    if (role !== 'Interviewer') {
      baseItems.push(
        getItem(<Link to="/request">Request</Link>, '/request', <CarryOutFilled />)
      );
    }

    // Thêm User menu cho Admin
    if (role === 'Admin') {
      baseItems.push(
        getItem(<Link to="/user">User</Link>, '/user/permissions', <UserOutlined />)
      );
    }

    return baseItems;
  };
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (user && user.role) {
      const menuItems = getMenuItems(user.role);
      setItems(menuItems);
    }
  }, [user?.role]);


  const ModalChangePassword = () => {
    return (
      <Modal
        title={"CHANGE PASSWORD"}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => { }}
        footer={[]}
        className="text-xl"
        width={600}
      >
        <Form
          name="layout-multiple-horizontal"
          layout="horizontal"
          className="w-full mt-10"
          onFinish={async (data) => {
            await dispatch(updatePassword(data));
            setIsModalVisible(false);
          }}
          labelCol={{ span: 6 }}
        >
          <Form.Item
            name="password"
            label="Old password:"
            rules={[{ required: true, message: 'Please enter old password' }]}
          >
            <Input.Password
              placeholder={"Enter old password"}
            />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="New password:"
            rules={[{ required: true, message: 'Please enter new password' }]}>
            <Input.Password
              placeholder={"Enter new password"} />
          </Form.Item>
          <div className="w-full flex justify-end gap-x-5 mt-5">
            <Form.Item>
              <button
                className="border-blue-500 border px-4 py-2 text-blue-500 rounded"
                onClick={() => setIsModalVisible(false)}
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

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => setIsModalVisible(true)}>
        <SettingOutlined />&nbsp; Change Password
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={() => {
        localStorage.clear();
        window.location.href = '/login';
      }}>
        <LogoutOutlined />&nbsp; Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <ModalChangePassword />
      {isAuth ? (
        <Layout style={{ minHeight: '100vh' }}>
          <Header className="w-full h-20 flex shadow-lg justify-between items-center pl-0 pr-5 bg-gray-200">
            <div className="w-[300px] flex justify-center items-center">
              <Image src={'/assets/logo.png'} className="p-2" width={100} preview={false} />
            </div>
            <Dropdown overlay={userMenu} placement="bottomLeft">
              <div>
                <Avatar size={40} icon={<UserOutlined />} />
              </div>
            </Dropdown>
          </Header>
          <Layout className="mt-2">
            <Sider trigger={true} theme="light" className="pt-3" width={300} collapsible collapsed={collapsed}>
              <div className="demo-logo-vertical" />
              <Menu theme="light" defaultSelectedKeys={[active]} mode="inline" items={items} />
            </Sider>
            <Layout>
              <Content
                style={{
                  margin: '0px 10px',
                  minHeight: 280,
                  borderRadius: borderRadiusLG,
                }}
                className="shadow-lg"
              >
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default LayoutWrapper;
