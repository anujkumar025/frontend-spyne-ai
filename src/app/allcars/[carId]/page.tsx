"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { API_URL } from "@/lib/utils";
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
          const response = await axios.get(`${API_URL}cars/${carId}`, {
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
          `${API_URL}cars/${carDetails._id}`,
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
      <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-500">Loading car details...</span>
        </div>
      ) : (
        <Card className="w-full max-w-3xl p-6 space-y-8 shadow-lg bg-white rounded-2xl">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
              {carDetails?.title || "Car Title"}
            </h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push(`/allcars/update/${carDetails?._id}`)}
              >
                Edit Listing
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700"
                onClick={() => alert("Deleting...")}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-700">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {carDetails?.description || "No description provided."}
              </p>
            </div>

            {/* Tags Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-700">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Car Type", value: carDetails?.tags?.carType },
                  { label: "Company", value: carDetails?.tags?.company },
                  { label: "Dealer", value: carDetails?.tags?.dealer },
                ].map((detail, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <p className="text-sm text-gray-500">{detail.label}</p>
                    <p className="font-medium text-gray-800">{detail.value || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-700">Gallery</h2>
              {carDetails?.images && carDetails.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {carDetails.images.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg border shadow-sm">
                      <img
                        src={image}
                        alt={`Car preview ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed text-gray-500 bg-gray-50">
                  No images available
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
    )
}