"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Car = {
  _id: string;
  title: string;
  description: string;
  tags: {
    carType: string;
    company: string;
    dealer: string;
  };
  images:[]
};

export default function CarsDetails({
    params
  }: {
    params: Promise<{ carId: string }>
  }){
    const [carDetails, setCarDetails] = useState<Car>();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      const fetchData = async () => {
        const carId = (await params).carId;
        try {
          const response = await axios.get(`http://localhost:5000/api/cars/${carId}`, {
            headers: {
              Authorization: `${token}`
            }
        });
          setCarDetails(response.data.car); 
          console.log(response.data.car);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching car details:", error);
        }
      };
      fetchData();
    }, []);

    async function handleDelete() {
      const token = localStorage.getItem('authToken');
      
      if (!carDetails?._id) {
        alert('No car selected');
        return;
      }
    
      try {
        const confirmDelete = window.confirm("Are you sure you want to delete this car?");
        if (!confirmDelete) return;
    
        const response = await axios.delete(
          `http://localhost:5000/api/cars/${carDetails._id}`,
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );
    
        if (response.status === 200) {
          // alert('Car deleted successfully');
          router.push('/allcars'); // Redirect to home page or cars list
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            alert('Unauthorized - Please login again');
            router.push('/login');
          } else if (error.response?.status === 404) {
            alert('Car not found');
          } else {
            alert('Failed to delete car');
          }
        } else {
          console.error('Unexpected error:', error);
          alert('An unexpected error occurred');
        }
      }
    }

    return (
      <div className="w-screen h-screen flex flex justify-center items-center">
        {loading && <div>Loading...</div>}
        {!loading && 
          <Card className="w-1/2 flex flex-col p-6 gap-5">
            <div className="flex justify-between">
              <div>
                {carDetails?.title}
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => router.push(`/allcars/update/${carDetails?._id}`)}>Update</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
            <div>
              {carDetails?.description}
            </div>
            <div>
              <h2>Tags</h2>
              Car Type: {carDetails?.tags.carType}
              <br/>
              Company: {carDetails?.tags.company}
              <br/>
              Dealer: {carDetails?.tags.dealer}
            </div>
            {carDetails?.images && carDetails?.images.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {carDetails?.images.map((image, index) => (
                  <img key={index} src={image} alt={`Car Image ${index + 1}`} className="w-40 h-40 object-cover" />
                ))}
              </div>
            ) : (
              <p>No images available</p>
            )}
          </Card>
        }
      </div>
    )
}