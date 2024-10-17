import { Button } from "antd";
import ModalComponent from "#/component/ModalComponent";
import {ArrowLeftOutlined} from "@ant-design/icons";
import Link from "next/link";

const Header: React.FC <{
    data: any
    idUser: string
    refreshTable: () => void 
}> = ({data, idUser, refreshTable}) => {

    const {id, nama_project, file_project, start_date, end_date, status, note} = data;
    const buttonStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return {backgroundColor: 'rgba(255, 193, 7, 0.1)', borderColor: '#FFC107', color: '#FFC107'};
            case 'on-progress':
                return {backgroundColor: 'rgba(0, 188, 212, 0.1)', borderColor: '#00BCD4', color: '#00BCD4'};
            case 'done':
                return {backgroundColor: 'rgba(33, 150, 243, 0.1)', borderColor: '#2196F3', color: '#2196F3'};
            default:
                return {backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4CAF50', color: '#4CAF50'};
        }
    };

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-2 rounded-full w-8 h-8 border-0 flex justify-center items-center ml-2">
                    <Link href={`/super-admin/${idUser}/project`} className="no-underline text-black">
                        <ArrowLeftOutlined />
                    </Link>
                </Button>
                <h1 style={{ marginLeft: '8px', marginTop: '10px', fontSize: '25px', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                    {nama_project}
                </h1>
            </div>
            <div style={{display: 'flex', gap: 20, fontFamily: 'Arial', marginTop: 5, marginBottom: 5}}>

                <button
                    type="button"
                    className="border py-3 px-6 rounded"
                    style={buttonStatusStyle(status)}
                >
                    {status}
                </button>
            </div>
        </div>
    )
};

export default Header;