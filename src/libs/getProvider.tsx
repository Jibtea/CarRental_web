export default async function getProvider(id: string) {
    const response = await fetch(`http://localhost:5000/RentalC01/rentalCarProvider/${id}`)
    if (!response.ok) {
        throw new Error("Failed to fetch Provider")
    }
    return await response.json()
}