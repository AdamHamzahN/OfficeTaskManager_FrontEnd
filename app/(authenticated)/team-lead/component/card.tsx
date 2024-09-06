"use client";

import React from "react";
import { Card, Space } from 'antd';

interface CardDashboardProps {
  children: React.ReactNode;
  style?: React.CSSProperties; 
}


const CardDashboard: React.FC<CardDashboardProps> = ({ children ,style}) => {
  return (
    <Space direction="vertical" size={10}>
      <Card title="Default size card" headStyle={{ backgroundColor: 'blue', color: 'white',fontSize: 20 }} style={{textAlign:"center",...style}}>
        {children}
      </Card>
    </Space>
  );
};

export default CardDashboard;
