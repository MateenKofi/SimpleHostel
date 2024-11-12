import { create } from 'zustand'

interface Amenity {
    name: string;
    price: number;
}

export const useAmenityStore = create<{
    amenities: Amenity[];
    addAmenity: (amenity: Amenity) => void;
    removeAmenity: (amenity: Amenity) => void;
}>((set) => ({
    amenities: [],
    addAmenity: (amenity) => set((state) => ({ 
        amenities: [...state.amenities, amenity] 
    })),
    removeAmenity: (amenity) => set((state) => ({
        amenities: state.amenities.filter(a => a.name !== amenity.name)
    }))
})) 