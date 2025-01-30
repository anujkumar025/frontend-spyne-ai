"use client";

import { useEffect, useState } from "react"
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/utils";

// Define the car type
type Car = {
    _id: string;
    title: string;
    description: string;
    tags: {
      carType: string;
      company: string;
      dealer: string;
    };
};

export default function AllCars(){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState<Car[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    async function getAllCars(){
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}cars`, {
            headers: {
              Authorization: `${token}`
            }
        });
        setCars(response.data.cars);
        setLoading(false);
    }

    useEffect(() => {
        getAllCars();
    }, []);

    function handleClick(e: React.FormEvent, carId: string){
        e.preventDefault();
        router.push(`/allcars/${carId}`);
    }

    const filterCars = (cars: Car[], term: string) => {
        if (!term) return cars;
        
        const lowerTerm = term.toLowerCase();
        return cars.filter(car => {
            const title = car.title?.toLowerCase() || '';
            const description = car.description?.toLowerCase() || '';
            const tags = car.tags || {};
    
            // Check each tag field individually
            const carType = tags.carType?.toLowerCase() || '';
            const company = tags.company?.toLowerCase() || '';
            const dealer = tags.dealer?.toLowerCase() || '';

            return (
                title.includes(lowerTerm) ||
                description.includes(lowerTerm) ||
                carType.includes(lowerTerm) ||
                company.includes(lowerTerm) ||
                dealer.includes(lowerTerm)
            );
        });
    };

    const filteredCars = filterCars(cars, searchTerm);
    const hasSearchResults = searchTerm && filteredCars.length > 0;
    const showAllCars = !searchTerm || filteredCars.length === 0;

    return (
        <div className="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8 flex justify-center items-center">
            {loading ? (
                <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-muted-foreground">Loading your cars...</span>
                </div>
            ) : (
                <Card className="w-full max-w-2xl p-6 space-y-6 shadow-lg">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                    {localStorage.getItem('username')}'s Garage
                    </h1>
                    <div className="w-full md:w-auto">
                    <Input
                        placeholder="Search by title, description, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                    {hasSearchResults && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium text-muted-foreground">
                        Search results for "<span className="text-primary">{searchTerm}</span>"
                        </h2>
                        <div className="grid gap-4">
                        {filteredCars.map((car) => (
                            <Card
                            key={`search-${car._id}`}
                            className="p-4 transition-all duration-200 hover:bg-accent/50 cursor-pointer group"
                            onClick={(e) => handleClick(e, car._id)}
                            >
                            <h3 className="font-medium group-hover:text-primary">{car.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {car.description}
                            </p>
                            </Card>
                        ))}
                        </div>
                    </div>
                    )}

                    {showAllCars && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium text-muted-foreground">
                        All Vehicles
                        </h2>
                        <div className="grid gap-4">
                        {cars.map((car) => (
                            <Card
                            key={`all-${car._id}`}
                            className="p-4 transition-all duration-200 hover:bg-accent/50 cursor-pointer group"
                            onClick={(e) => handleClick(e, car._id)}
                            >
                            <h3 className="font-medium group-hover:text-primary">{car.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {car.description}
                            </p>
                            </Card>
                        ))}
                        </div>
                    </div>
                    )}

                    {searchTerm && filteredCars.length === 0 && (
                    <div className="flex flex-col items-center gap-4 py-12 text-center">
                        <div className="text-2xl">🚗</div>
                        <div>
                        <p className="text-muted-foreground font-medium">
                            No cars found matching
                        </p>
                        <p className="text-primary font-semibold">"{searchTerm}"</p>
                        </div>
                    </div>
                    )}
                </div>
                </Card>
            )}
            </div>
    )
}