import { Card, Col } from "antd";
import Link from "next/link";
import { CalendarOutlined , RightOutlined} from '@ant-design/icons';

const ProjectList: React.FC<{
    title: React.ReactNode,
    link: string,
    teamLead: React.ReactNode,
    startDate: string,
    endDate: string
}> = ({ title, link, teamLead, startDate, endDate }) => (
    <div style={{ width: '100%', marginBottom: '30px', boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px',borderRadius:8 }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            marginBottom: 10,
            fontSize: '20px',
            padding:3,
            fontFamily:'Plus Jakarta Sans'
        }}>
            <div style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
                {title}
            </div>
            <span style={{ fontWeight: 'bold', marginLeft: '10px', textDecoration: 'none' }}>
                <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <RightOutlined />
                </Link>
            </span>
        </div>
        <div style={{ backgroundColor: 'rgba(242, 246, 249, 1)', display: 'flex', borderRadius: 8, justifyContent: 'space-between', padding: 10 }}>
            <div style={{ marginLeft: 10 }}>
                <div>
                    <h4 style={{ color: 'rgba(109, 117, 128, 1)' }}>Penanggung Jawab</h4>
                    <span style={{fontWeight:'bold'}}>{teamLead}</span>
                </div>
            </div>
            <div style={{ display: 'flex', borderRadius: 8, justifyContent: 'space-between', marginRight: 100 }}>
                <div style={{ height: '100%', alignItems: 'center', margin:10, fontSize: 20, color: 'rgba(109, 117, 128, 0.15)' }}>
                    <span>|</span>
                </div>
                <div style={{ marginRight:100 }}>
                    <h4 style={{ color: 'rgba(109, 117, 128, 1)' }}><CalendarOutlined />Start Date</h4>
                    <span style={{fontWeight:'bold'}}>{startDate}</span>
                </div>
                <div style={{ height: '100%', alignItems: 'center', margin:10, fontSize: 20, color: 'rgba(109, 117, 128, 0.15)' }}>
                    <span>|</span>
                </div>
                <div>
                    <h4 style={{ color: 'rgba(109, 117, 128, 1)' }}><CalendarOutlined />End Date</h4>
                    <span style={{fontWeight:'bold'}}>{endDate}</span>
                </div>
            </div>
        </div>
    </div>

);

export default ProjectList;