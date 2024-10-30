const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

// Create a custom token to log POST request data
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';  // Log body only for POST requests
});

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'  // Adjust this to your frontend's URL
}));

// Middleware to log requests including POST data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));  // Use custom token

const persons = [
    { 
        id: "1",
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: "2",
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: "3",
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: "4",
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
];

// Route to get all phonebook entries
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// Route to show info about the phonebook
app.get('/info', (req, res) => {
    const currentTime = new Date();
    const responseText = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime}</p>
    `;
    res.send(responseText);
});

// Route to get a single person by ID
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);
    
    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

// Route to delete a person by ID
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const index = persons.findIndex(p => p.id === id);

    if (index !== -1) {
        persons.splice(index, 1);
        res.status(204).end();  // Respond with 204 No Content
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

// Route to add a new person with error handling
app.post('/api/persons', (req, res) => {
    console.log('Request Body:', req.body);  // Log the request body for debugging
    const { name, number } = req.body;

    // Check if name and number are provided
    if (!name || !number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    // Check if the name already exists
    if (persons.find(p => p.name === name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    // Generate a new unique ID
    const id = Math.floor(Math.random() * 1000000).toString();

    const newPerson = {
        id,
        name,
        number
    };

    persons.push(newPerson);
    res.status(201).json(newPerson);  // Respond with 201 Created
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/favicon.ico', express.static('favicon.ico'));
