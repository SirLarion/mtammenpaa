export interface RestaurantType {
    blurhash: string;
    launch_date: string;
    location: number[];
    name: string;
    online: boolean;
    popularity: number;
}

export interface SectionType {
    title: string;
    restaurants: RestaurantType[];
}
