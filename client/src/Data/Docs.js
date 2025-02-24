import io from 'socket.io-client';
export const API_URL = 'https://school-management-system-1054135130636.asia-south1.run.app';
// export const API_URL = 'http://localhost:8080';
export const socket = io(API_URL);

export const days =[
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
];

export const classes = ["nursery","LKG","UKG","1","2","3","4","5","6","7","8","9","10"];
