'use client';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addReservation } from "@/redux/features/cartSlice";
import { BookingItem, ProviderItem } from "../../../interfaces";
import DateReserve from "@/components/LocationDateReserve";
import { useSearchParams } from "next/navigation";
import getProviders from "@/libs/getProviders";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";

export default function Reservations() {
    const { data: session, status } = useSession();

    /*if (!session) {
        return <p>You are not logged in</p>;
    }*/

    const urlParams = useSearchParams();
    const uid = urlParams.get('id');
    const name = urlParams.get('name');

    const dispatch = useDispatch<AppDispatch>();

    const makeReservation = () => {
        if (uid && name && pickupDate && dropoffDate) {
            const item: BookingItem = {
                _id: '',//session.user._id,
                user: '',//session.user.name,
                pickupDate: dayjs(pickupDate).format("YYYY/MM/DD"),
                dropoffDate: dayjs(dropoffDate).format("YYYY/MM/DD"),
                rentalCarProvider: name,
                createdAt: dayjs().format("YYYY/MM/DD"),
            };
            dispatch(addReservation(item));
        }
    };

    const [options, setOptions] = useState<{ _id: number, name: string }[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [pickupDate, setPickupDate] = useState<Dayjs | null>(null);
    const [dropoffDate, setDropOffDate] = useState<Dayjs | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    // Fetch providers using useEffect
    useEffect(() => {
        const fetchProviders = async () => {
            const response = await getProviders();
            if (response && response.data) {
                const providers = response.data.map((provider: ProviderItem) => ({
                    id: provider._id,  // Use `pid` as `id`
                    name: provider.name,
                }));
                setOptions(providers); // Update state with the necessary fields
            }
        };
        fetchProviders();
    }, []);


    return (
        <main className="w-[100%] flex flex-col items-center space-y-4">
            <div className="flex-flex-col items-center text-xl font-medium">New Reservation</div>
            <div className="flex-flex-col items-center text-xl font-medium">Provider</div>
            <select
                id="dynamic-dropdown"
                value={selectedOption}
                onChange={handleChange}
            >
                {options.length > 0 ? (
                    options.map((provider) => (
                        <option key={provider._id} value={provider._id}>
                            {provider.name}
                        </option>
                    ))
                ) : (
                    <option>Loading...</option>
                )}
            </select>
            <div className="w-fit space-y-2">
                <div className="text-md text-left text-gray-600">Pick-Up Date</div>
                <DateReserve onDateChange={(value: Dayjs) => { setPickupDate(value) }} />
                <div className="text-md text-left text-gray-600">Return Date and Location</div>
                <DateReserve onDateChange={(value: Dayjs) => { setDropOffDate(value) }} />
            </div>
            <button
                className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 shadow-sm text-white"
                onClick={makeReservation}
            >
                Make reservation with this provider
            </button>
        </main >
    );
}


/**
 * import { useEffect, useState } from 'react';
import getProviders from "@/libs/getProviders";
import { ProviderItem } from '../../../interfaces';

const MyComponent = () => {
    const [options, setOptions] = useState<{ id: string, name: string }[]>([]); // กำหนดชนิดของ state ให้ชัดเจน
    const [loading, setLoading] = useState(true); // ใช้สถานะ loading เพื่อให้ผู้ใช้ทราบว่าโหลดข้อมูล

    useEffect(() => {
        console.log("useEffect has been triggered");  // ตรวจสอบว่า useEffect ถูกเรียกใช้งานหรือไม่
        const fetchProviders = async () => {
            console.log("Fetching providers...");  // ดูว่า fetchProviders ถูกเรียก
            try {
                const response = await getProviders();  // ดึงข้อมูลจาก API
                console.log("Response:", response);  // ตรวจสอบค่าของ response
                if (response && response.data) {
                    const providers = response.data.map((provider: ProviderItem) => ({
                        id: provider._id,  // ใช้ `provider._id` เป็น `id`
                        name: provider.name,  // ใช้ `provider.name` เป็น `name`
                    }));
                    setOptions(providers);  // อัปเดต state ด้วยข้อมูลใหม่
                    setLoading(false);
                } else {
                    console.error("No data found in response.");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch providers:", error);
                setLoading(false); // หากเกิดข้อผิดพลาดในการดึงข้อมูล
            }
        };

        fetchProviders();  // เรียกฟังก์ชันที่ดึงข้อมูล
    }, []);  // ใช้ empty dependency array ทำให้ effect นี้ทำงานเพียงครั้งเดียวเมื่อ component mount

    if (loading) return <p>Loading providers...</p>; // เมื่อข้อมูลกำลังโหลด ให้แสดงข้อความนี้

    return (
        <div>
            <h1>Provider Options</h1>
            <ul>
                {options.length > 0 ? (
                    options.map((option) => (
                        <li key={option.id}>{option.name}</li>
                    ))
                ) : (
                    <p>No providers available</p>  // กรณีไม่มีข้อมูล
                )}
            </ul>
        </div>
    );
};

export default MyComponent;

 */
