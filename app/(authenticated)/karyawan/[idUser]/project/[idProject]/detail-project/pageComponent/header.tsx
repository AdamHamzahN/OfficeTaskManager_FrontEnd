import { config } from "#/config/app";
import { Button, Select } from "antd";
import { ArrowLeftOutlined,SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import ModalComponent from "#/component/ModalComponent";
import ModalDetailProject from "#/app/(authenticated)/team-lead/[idUser]/project/[idProject]/detail-project/modal/modalDetailProject";


const Header: React.FC<{
    data:any
    idUser : string
}> = ({ data, idUser}) => {
    const { id, nama_project, nama_team, file_project, start_date, end_date, note, status, user } = data;
    const getButtonStyles = (status: string) => {
        switch (status) {
            case 'pending':
                return { backgroundColor: 'rgba(255, 193, 7, 0.1)', borderColor: '#FFC107', color: '#FFC107' };
            case 'on-progress':
                return { backgroundColor: 'rgba(0, 188, 212, 0.1)', borderColor: '#00BCD4', color: '#00BCD4' };
            case 'redo':
                return { backgroundColor: 'rgba(244, 67, 54, 0.1)', borderColor: '#F44336', color: '#F44336' };
            case 'done':
                return { backgroundColor: 'rgba(33, 150, 243, 0.1)', borderColor: '#2196F3', color: '#2196F3' };
            default:
                return { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4CAF50', color: '#4CAF50' };
        }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-1 px-2 rounded-full w-8 h-8 border-0 flex justify-center items-center ml-2">
                    <Link href={`/team-lead/${idUser}/project`} className="no-underline text-black">
                        <ArrowLeftOutlined />
                    </Link>
                </button>
                <h3 style={{ marginLeft: '8px', marginTop: '10px', fontSize: '25px', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                    {nama_project}
                </h3>
            </div>
            <div style={{ display: 'flex', gap: 20, fontFamily: 'Arial', marginTop: 5, marginBottom: 5 }}>
                <ModalComponent
                    title={'Detail Tugas'}
                    content={<ModalDetailProject
                        nama_project={nama_project}
                        team_lead={user.username }
                        nama_team={nama_team }
                        status={status}
                        start_date={start_date}
                        end_date={end_date}
                        note={note}
                        file_project={file_project}
                    />}
                    footer={(handleOk) => (
                        <div>
                            <Button type="primary" onClick={handleOk}>Ok</Button>
                        </div>
                    )}
                    onOk={() => console.log('Ok clicked')}  // Tambahkan handler onOk
                    onCancel={() => console.log('Cancel clicked')}  // Tambahkan handler onCancel
                >
                    <button type="button" className="bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white py-3 px-6 border border-blue-600 hover:border-transparent rounded text-justify">
                        <SearchOutlined style={{ fontSize: 15 }} /> Detail Project
                    </button>
                </ModalComponent>
                <button
                    type="button"
                    className="border py-3 px-6 rounded"
                    style={getButtonStyles(status)}
                >
                    {status}
                </button>
            </div>
        </div>
    );
};
export default Header;
