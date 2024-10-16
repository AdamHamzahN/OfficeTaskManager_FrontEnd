import React, { useState } from 'react';
import { Button, Modal } from 'antd';

interface ModalComponentProps {
    content: React.ReactNode;
    title: string;
    children?: React.ReactNode;
    footer: (handleCancel: () => void, handleOk: () => void) => React.ReactNode;
    onOk?: () => void;
    onCancel?: () => void;
    visible?: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    content,
    title,
    children,
    footer,
    onOk,
    onCancel,
    visible
}) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handleCancel = () => {
        setIsModalVisible(false);
        if (onCancel) {
            onCancel();
        }
    };

    const handleOk = () => {
        if (onOk) {
            onOk();
        }
        setIsModalVisible(false);
    };

    return (
        <>
            <div onClick={() => setIsModalVisible(true)}>
                {children}
            </div>
            <Modal
                title={title}
                open={visible !== undefined ? visible : isModalVisible}
                onCancel={handleCancel}
                footer={footer ? footer(handleCancel, handleOk) : null}
                // visible={visible !== undefined ? visible : isModalVisible}
                destroyOnClose={true}
            >
                <div style={{borderTop:'1px solid lightgray', padding:'20px', borderBottom:'1px solid lightgray'}}>
                    {content}
                </div>
            </Modal>
        </>
    );
};

export default ModalComponent;
