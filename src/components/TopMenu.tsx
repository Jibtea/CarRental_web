import styles from './topmenu.module.css'
import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Link } from '@mui/material';

export default async function TopMenu() {

    const session = await getServerSession(authOptions)

    return (
        <div className={styles.menucontainer}>
            <Image src={'/img/logo.png'} className={styles.logoimg} alt='logo'
                width={0} height={0} sizes='100vh' />
            {session ? '' : <TopMenuItem title='Register Now' pageRef='/api/auth/register' />}
            <TopMenuItem title='Your reservation' pageRef='/cart/' />
            <div className="flex flex-row absolute right-0 h-full">
                {/* <TopMenuItem title='Cart' pageRef='/cart/' />
                <TopMenuItem title='Select Car' pageRef='/car/' />
                <TopMenuItem title='Reservation' pageRef='/reservations' />
                <TopMenuItem title='About' pageRef='/about' /> */}
                {
                    session ? <Link href="/logout">
                        <div className='flex items-center h-full px-2
                     text-cyan-600 text-sm'>Logout of {session.user?.name}</div></Link>
                        : <Link href="/login"><div className='flex items-center h-full px-2
                     text-cyan-600 text-sm'>Login</div></Link>
                }
            </div>

        </div>
    );
}
