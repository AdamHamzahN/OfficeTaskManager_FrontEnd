"use client";
import React from "react";
import { Card, Space } from 'antd';

const CardDashboard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
}> = ({ children, style, title }) => {
  return (
    <Space direction="vertical" size={10}>
      <Card title={title} headStyle={{ backgroundColor: '#1890FF', color: 'white', fontSize: 20 }} style={{ textAlign: "center", ...style }}>
        {children}
      </Card>
    </Space>
  );
};

export default CardDashboard;
