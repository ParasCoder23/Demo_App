import axios from 'axios';
import { Item } from '../types/Item';

const API_URL = 'http://localhost:8080';

export const api = {
    getItems: () => axios.get<Item[]>(`${API_URL}/items/`),
    getItem: (id: number) => axios.get<Item>(`${API_URL}/items/${id}`),
    createItem: (item: Omit<Item, 'id'>) => axios.post<Item>(`${API_URL}/items/`, item),
    updateItem: (id: number, item: Omit<Item, 'id'>) => axios.put<Item>(`${API_URL}/items/${id}`, item),
    deleteItem: (id: number) => axios.delete(`${API_URL}/items/${id}`)
};
