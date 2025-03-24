"use client"
import { useAppSelector } from "@/redux/store"
import { AppDispatch } from "@/redux/store"
import { removeReservation } from "@/redux/features/cartSlice"
import { useDispatch, UseDispatch } from "react-redux"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import getUserProfile from '@/libs/getUserProfile';
import { useRouter } from "next/navigation"

export default function ReservationCart() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);


  const [editedBooking, setEditedBooking] = useState<any>(null); // ตัวแปรเก็บการจองที่ต้องการแก้ไข
  const [isEditing, setIsEditing] = useState<boolean>(false); // ใช้เพื่อติดตามการแก้ไข
  const [editText, setEditText] = useState<string>(""); // ข้อความที่ต้องการแก้ไข

  const handleCheckboxChange = (bookingId: string) => {
    if (editedBooking === bookingId) {
      setEditedBooking(null);
      setIsEditing(false);
      setEditText("");
    } else {
      setEditedBooking(bookingId);
      setIsEditing(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleSave = () => {
    if (editedBooking && editText) {
      // ส่งข้อมูลที่แก้ไขกลับไปที่ server หรือการจัดการข้อมูล
      console.log(`Saving changes for booking ${editedBooking}: ${editText}`);
      setIsEditing(false);
      setEditedBooking(null);
      setEditText(""); // ล้างข้อความหลังจากบันทึก
    }
  };

  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(session.user.token);
        setUser(userProfile);
      } catch (error) {
        console.log('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  useEffect(() => {
    if (session?.user?.token) {
      getBooking(); // ดึงข้อมูลการจองหลังจาก session พร้อม
    }
  }, [session]);


  const getBooking = async () => {
    try {
      const response = await fetch('http://localhost:5000/RentalC01/booking', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.token}`
        }

      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.data)
      setBookings(data.data)
      console.log("Data received:", data);
      console.log("1111111")
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  }

  const deleteBooking = async (_id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/RentalC01/booking/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.token}`  // อย่าลืมส่ง token ถ้า API ต้องการ
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== _id));
      console.log("Booking deleted:", data);
      // คุณอาจต้องอัปเดต UI หลังจากการลบเสร็จ
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };


  const router = useRouter();
  const handleRedirect = (id: string) => {
    // เปลี่ยนเส้นทางไปยังหน้าการอัปเดตของการจอง
    router.push(`/reservation/update/${id}`);
  };


  const calculateDuration = (pickupDate: string, dropoffDate: string): number => {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const timeDifference = dropoff.getTime() - pickup.getTime();
    return timeDifference / (1000 * 3600 * 24);
  }
  return (
    <>
      <h1>Your Bookings</h1>
      <ul>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((bookingItem) => (
            <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={bookingItem._id}>
              {/* แก้ไขการแสดงผลของ user และ rentalCarProvider */}
              <div className="text-xl">{bookingItem.user?.name}</div> {/* แสดงชื่อของผู้ใช้ */}
              <div className="text-l">provider: {bookingItem.rentalCarProvider?.name}</div> {/* แสดงชื่อผู้ให้บริการ */}
              <div className="text-sm">Pick-Up: {new Date(bookingItem.pickupDate).toLocaleDateString()}</div>
              <div className="text-sm">Drop-off: {new Date(bookingItem.dropoffDate).toLocaleDateString()}</div>
              <div className="text-md">
                Duration: {calculateDuration(bookingItem.pickupDate, bookingItem.dropoffDate)} days
              </div>
              <button
                className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm"
                onClick={() => deleteBooking(bookingItem._id)}
              >
                Remove from Cart
              </button>
              <button
                className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm"
                onClick={() => handleRedirect(bookingItem._id)}
              >
                update this reservation
              </button>

            </div>
          ))
        )}
      </ul>
    </>
  );

}

