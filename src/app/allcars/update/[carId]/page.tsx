"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Car {
  _id: string;
  title: string;
  description: string;
  tags: {
    carType: string;
    company: string;
    dealer: string;
  };
  images: string[];
}

export default function UpdateCarPage({ params }: { params: { carId: string } }) {
  const [carData, setCarData] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: {
      carType: '',
      company: '',
      dealer: ''
    }
  });
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [carId, setCarId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const { carId } = await params;
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5000/api/cars/${carId}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        setCarData(response.data.car);
        setFormData({
          title: response.data.car.title,
          description: response.data.car.description,
          tags: response.data.car.tags
        });
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    };
    fetchCarData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const formPayload = new FormData();
      const { carId } = await params;
      
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('tags[carType]', formData.tags.carType);
      formPayload.append('tags[company]', formData.tags.company);
      formPayload.append('tags[dealer]', formData.tags.dealer);

      if (selectedImages) {
        Array.from(selectedImages).forEach(file => {
          formPayload.append('images', file);
        });
      }

      await axios.put(`http://localhost:5000/api/cars/${carId}`, formPayload, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      router.push(`/allcars/${carId}`);
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  if (!carData) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-1/2 p-6 border rounded-lg">
        <h1 className="text-2xl mb-4">Update Car Details</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <Input
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Car Type"
              value={formData.tags.carType}
              onChange={(e) => setFormData({
                ...formData,
                tags: {...formData.tags, carType: e.target.value}
              })}
            />
            <Input
              placeholder="Company"
              value={formData.tags.company}
              onChange={(e) => setFormData({
                ...formData,
                tags: {...formData.tags, company: e.target.value}
              })}
            />
            <Input
              placeholder="Dealer"
              value={formData.tags.dealer}
              onChange={(e) => setFormData({
                ...formData,
                tags: {...formData.tags, dealer: e.target.value}
              })}
            />
          </div>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setSelectedImages(e.target.files)}
          />
          <div className="flex gap-2">
            <Button type="submit">Update</Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}