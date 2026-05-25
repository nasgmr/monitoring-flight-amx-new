import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';

export const uploadUlog = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_URL}/analyze`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};