"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from '@/components/ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { API_URL } from "@/lib/utils"

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
        const response = await axios.get(`${API_URL}cars/${carId}`, {
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

      await axios.put(`${URL}cars/${carId}`, formPayload, {
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

  // if (!carData) return <div>Loading...</div>;

  return (
    
    <div className="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8 flex justify-center items-center">
      {!carData? 
      <div className="flex flex-col items-center gap-3">
      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="text-gray-500">Loading...</span>
    </div>:
      <Card className="w-full max-w-2xl p-6 space-y-6 shadow-lg">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Update Vehicle Listing</h1>
          <p className="text-muted-foreground">Modify your car details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Title</Label>
              <Input
                placeholder="Enter vehicle title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <textarea
                placeholder="Enter detailed description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Vehicle Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Car Type"
                  value={formData.tags.carType}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: {...formData.tags, carType: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Company"
                  value={formData.tags.company}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: {...formData.tags, company: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Dealer"
                  value={formData.tags.dealer}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: {...formData.tags, dealer: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Update Images</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="i-lucide-upload-cloud text-xl mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB each
                    </p>
                  </div>
                  <Input 
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedImages(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Image Previews */}
            {selectedImages && selectedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {Array.from(selectedImages).map((file, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
        }
    </div>
  );
}