import {createContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {requestLogin, requestRegister} from "@/redux/features/authSlice.ts";
import {ILoginData, IRegisterData} from "@/interfaces";
import {RootState} from "@/redux/store.ts";

export const AuthContext = createContext<any>(null);

// @ts-ignore
export const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((root: RootState) => root.auth.currentUser);
  const login = (data: ILoginData) => {
    dispatch(requestLogin(data)).unwrap().then((res) => {
      localStorage.setItem("token", res?.accessToken || "");
      navigate("/", {replace: true});
    });

  };
  const register = (data: IRegisterData) => {
    dispatch(requestRegister(data)).unwrap().then(() => {
      navigate("/login", {replace: true})
    })

  }
  const logout = () => {
    window.location.href = "/login";
    localStorage.clear()
  };

  const value = useMemo(
      () => ({
        user: user,
        login,
        logout,
        register,
        isAuth: user?.accessToken,
        isAdmin: user?.role?.trim() === "Admin",
        role: user?.role,
      }),
      [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
