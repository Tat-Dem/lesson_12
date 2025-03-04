import { Router, Request, Response } from 'express';
import { faker } from '@faker-js/faker';

const router = Router();

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

// Start with an empty array for users
let users: User[] = [];

// log requests
router.use((req: Request, res: Response, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Get all users
router.get('/', (req: Request, res: Response) => {
    console.log('Request received ...');
    console.log('Fetching all users');
    res.json(users);
});

// Add a new user
router.post('/', (req: Request, res: Response) => {
    console.log('Request received ...');
    const newUser = {
        id: faker.number.int(100),
        name: faker.person.firstName(),
        email: faker.internet.email(),
        phone: faker.phone.number()
    };
    users.push(newUser);

    console.log('Adding a new user', newUser);
    res.status(201).json(newUser);
});

// Get user by ID
router.get('/:id', (req: Request, res: Response) => {
    console.log('Request received ...');
    console.log(`Fetching user with ID: ${req.params.id}`);
    const user = users.find(u => u.id === parseInt(req.params.id));

    if (user) {
        console.log(`User with ID: ${req.params.id} found`, user);
        res.json(user);
    } else {
        console.log(`User with ID: ${req.params.id} not found`);
        res.status(404).json({ message: 'User not found' });
    }
});


// Delete a user by ID
router.delete('/:id', (req: Request, res: Response) => {
    console.log('Request received ...');
    console.log('request params', req.params);
    console.log(`Deleting user with ID: ${req.params.id}`);
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        console.log(`User with ID: ${req.params.id} deleted`);
        res.json(deletedUser);
    } else {
        console.log(`User with ID: ${req.params.id} not found`);
        res.status(404).json({ message: 'User not found' });
    }
});

export default router;
