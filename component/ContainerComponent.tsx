import React from "react";

const Container: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style}) => {
  return (
    <div style={{padding: 24, minHeight: '100vh', backgroundColor: '#FFF',borderRadius: 15,...style}}>
        {children}
    </div>
  );
};

export default Container;
