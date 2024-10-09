import React, { useState } from 'react';
import { Button, Popover } from 'antd';

const ProfileComponent: React.FC<{
  children: React.ReactNode,
  content: any,
}> = ({ children, content }) => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={content}
      title={
        <div style={{ borderBottom: '1px solid lightgray' }}>
            Profile
        </div>
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
        {children}
    </Popover>
  );
};

export default ProfileComponent;