"use client";

import { useEffect, useState } from "react"
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

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
        const response = await axios.get('http://localhost:5000/api/cars', {
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
        <div className="w-screen h-screen flex flex justify-center items-center">
            {loading && <div>Loading...</div>}
            {!loading && 
            <Card className="w-1/3 flex flex-col p-6 gap-5">
                <div className="flex justify-between items-center">
                    <div>{localStorage.getItem('username')}'s Cars</div>
                    <Input 
                        placeholder="Search cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48"
                    />
                </div>
                
                <div className="flex flex-col gap-5">
                    {hasSearchResults && (
                        <>
                            <div className="text-sm text-muted-foreground">
                                Search results for "{searchTerm}"
                            </div>
                            {filteredCars.map((car, index) => (
                                <Card key={`search-${index}`} className="p-3 hover:scale-105 transition-transform hover:cursor-pointer"
                                    onClick={(e) => handleClick(e, car._id)}    
                                >
                                    <div className="font-medium">{car.title}</div>
                                    <div className="text-sm text-muted-foreground">{car.description}</div>
                                </Card>
                            ))}
                        </>
                    )}

                    {showAllCars && (
                        <>
                            <div className="text-sm text-muted-foreground">
                                All your cars
                            </div>
                            {cars.map((car, index) => (
                                <Card key={`all-${index}`} className="p-3 hover:scale-105 transition-transform hover:cursor-pointer"
                                    onClick={(e) => handleClick(e, car._id)}    
                                >
                                    <div className="font-medium">{car.title}</div>
                                    <div className="text-sm text-muted-foreground">{car.description}</div>
                                </Card>
                            ))}
                        </>
                    )}

                    {searchTerm && filteredCars.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            No cars found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </Card>
            }
        </div>
    )
}