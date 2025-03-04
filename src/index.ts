import express from 'express';
import userController from './controllers/user-controller';

const app = express();
const port = 3000;

app.use(express.json());

// Use controllers
app.use('/users', userController);

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
