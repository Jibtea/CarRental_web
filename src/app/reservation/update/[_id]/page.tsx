"use client"
import getUserProfile from "@/libs/getUserProfile";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function updatePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);

  const { _id } = useParams();
  console.log(_id)
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [dropoffDate, setDropoffDate] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<any>(null); // Rental car provider
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (_id && typeof _id === 'string') {
      fetchBookingDetails(_id); // เรียกข้อมูลการจองด้วย id หาก id เป็น string
    }
  }, [_id]);

  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/RentalC01/booking/${id}`, {
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
      setBookingDetails(data.data);
      setPickupDate(data.data.pickupDate);
      setDropoffDate(data.data.dropoffDate);
      setSelectedOption(data.data.rentalCarProvider);
      setUser(data.data.user); // หรือดึงจาก session หรือจากข้อมูลอื่น
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching booking details:", error);
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
      }
    };

    fetchUserProfile();
  }, [session]);

  ///============updateBooking=============
  const SaveChanges = async () => {
    const updatedData = {
      user: bookingDetails.user,
      pickupDate: dayjs(pickupDate).format("YYYY-MM-DD"),
      dropoffDate: dayjs(dropoffDate).format("YYYY-MM-DD"),
      rentalCarProvider: selectedOption,
      createdAt: dayjs().toISOString(),
    };
    try {
      const response = await fetch(`http://localhost:5000/RentalC01/booking/${_id}`, {
        method: 'PUT', // หรือ 'PATCH' ขึ้นอยู่กับ API ของคุณ
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.token}`,  // ถ้ามี token
        },
        body: JSON.stringify(updatedData),  // ส่งข้อมูลการอัปเดต
      });

      console.log(JSON.stringify(updatedData))
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Booking updated successfully:', data);

    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <>
      <h1>Update Reservation</h1>
      {bookingDetails ? (
        <div>
          <h2>Your Reservation Id: {bookingDetails._id}</h2> {/* จะไม่มีข้อผิดพลาดหาก bookingDetails ถูกโหลดแล้ว */}
          <p>User: {bookingDetails.user.name}</p>
          <p>provider: {bookingDetails.rentalCarProvider.name}</p>
          <p>Pick-Up Date: {new Date(bookingDetails.pickupDate).toLocaleDateString()}</p>
          <p>Drop-Off Date: {new Date(bookingDetails.dropoffDate).toLocaleDateString()}</p>
          {/* คุณสามารถเพิ่มฟอร์มสำหรับการอัปเดตข้อมูลที่นี่ */}

          <div>
            <div>
              <label>Pick-up Date:</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>
            <div>
              <label>Drop-off Date:</label>
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
              />
            </div>
            <div>
              <label>Rental Car Provider:</label>
              <input
                type="text"
                value={selectedOption?.name}
                onChange={(e) => setSelectedOption({ ...selectedOption, name: e.target.value })}
              />
            </div>
            <div>
              <button onClick={SaveChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}