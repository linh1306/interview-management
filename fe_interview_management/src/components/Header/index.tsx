import {useState} from "react";
import {Link} from "react-router-dom";
import './index.scss'
import {LoginOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {HEADER_TABS} from "@/configs/constants.tsx";
import {useAuth} from "@/redux/hooks.ts";

const Index = () => {

  const [currentPage, setCurrentPage] = useState<number>(0);
  const auth = useAuth();

  return (
    <div className="h-24 w-full flex items-center sticky top-0 z-50">
      <div className="h-24 w-full bg-header-bar-bg flex justify-between items-center px-72">
        <Link to={"/"} className="flex h-full items-center">
          <img className="h-4/6" src="/assets/Lucky__2_-removebg-preview.png" alt="logo"/>
        </Link>
        <div className="flex items-center justify-center gap-3.5">
          {HEADER_TABS.map((tab) => (
            <Link
              key={tab.id}
              to={tab.link}
              className={`header-nav-item hover:text-header-bg-color text-header-text-color flex items-center cursor-pointer h-full ${tab.id === currentPage ? "selected-nav-item" : ''}`}
              onClick={() => setCurrentPage(tab.id)}
            >
              {tab.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-7 h-3/5 text-lg relative select-none">
          <div className="w-28 flex items-center justify-end">
            {auth.isAuth &&
              <div className="w-full flex justify-end gap-5 items-center">
                <UserOutlined className="h-12 w-12 rounded-full cursor-pointer text-header-text-color"/>
                <LogoutOutlined className="cursor-pointer h-10 w-10 flex justify-end text-header-text-color"
                                onClick={() => auth.logout()}
                />
              </div>
            }
            {!auth.isAuth &&
              <Link to={"/login"}>
                <LoginOutlined className="rotate-180 cursor-pointer h-10 w-10 flex justify-end text-header-text-color"/>
              </Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
