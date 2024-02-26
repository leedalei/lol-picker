import { Outlet, useLocation,history } from 'umi';
import './index.less';
import { useEffect } from 'react';

export default function Layout() {
  const location = useLocation()

  useEffect(()=>{
    if(location.pathname === "/"){
      if(localStorage.getItem("player")){
        history.replace("/home")
      }else{
        history.replace("/login")
      }
    }
  }, [location.pathname])

  return (
    <div>
      <Outlet />
    </div>
  );
}
