import { Card } from "antd";
import Link from "next/link";
import { CalendarOutlined, RightOutlined } from '@ant-design/icons';

const CardProjectDashboard: React.FC<{
    link: string,
    title: React.ReactNode,
    teamLead: React.ReactNode,
    startDate: string,
    endDate: string
}> = ({ link, title, teamLead, startDate, endDate }) => (
    <Card style={{ width: '100%',boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            fontFamily: 'Plus Jakarta Sans, sans-serif', 
        }}>
            <div style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 50px)'
            }}>
                {title}
            </div>
            <span style={{ fontWeight: 'bold', marginLeft: '10px', textDecoration: 'none' }}>
                <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <RightOutlined />
                </Link>
            </span>
        </div>

            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 17 , fontWeight: 'bold' }}>{teamLead}</span>

        <div style={{ backgroundColor: 'rgba(242, 246, 249, 1)', display: 'flex', borderRadius: 8, marginTop: 5 }}>
            <div style={{ padding: 10, marginRight: 5 }}>
                <h4 style={{ color: 'rgba(109, 117, 128, 1)' }}><CalendarOutlined /> Start Date</h4>
                <span style={{ fontWeight: 'bold' }}>{startDate}</span>
            </div>
            <div style={{ height: '100%', alignItems: 'center', margin: 20, fontSize: 20, color: 'rgba(109, 117, 128, 0.15)' }}>
                <span>|</span>
            </div>
            <div style={{ padding: 10 }}>
                <h4 style={{ color: 'rgba(109, 117, 128, 1)' }}><CalendarOutlined /> End Date</h4>
                <span style={{ fontWeight: 'bold' }}> {endDate}</span>
            </div>
        </div>
    </Card>
);

export default CardProjectDashboard;