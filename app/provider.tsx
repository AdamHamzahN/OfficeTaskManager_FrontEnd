"use client";

import React, {useEffect} from "react";
import {ConfigProvider} from "antd";
import {TokenUtil} from "#/utils/token";
import { SWRConfig } from "swr";
import { http } from "#/utils/http"; 

TokenUtil.loadToken();
export const Provider = ({children}: any) => {
  // useEffect(() => {
  //   // @ts-ignore
  //   document.documentElement.style.opacity = 1
  // }, []);

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890FF',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </SWRConfig>
  );
}
