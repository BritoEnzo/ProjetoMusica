const API_BASE = '/api';

class MediaAPI {
    static async getMedias() {
        const response = await fetch(`${API_BASE}/medias`);
        return await response.json();
    }

    static async createMedia(mediaData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/medias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(mediaData)
        });
        return await response.json();
    }

    static async updateMedia(id, mediaData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/medias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(mediaData)
        });
        return await response.json();
    }

    static async deleteMedia(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/medias/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }
}