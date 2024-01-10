const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const pathToFile = path.resolve('data', 'db.json');
const { promises: fsPromises } = require('fs');


app.use(express.json())
app.use(express.urlencoded({ extended:true }))


app.get('/users', (req, res) => {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
    });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const userId = +id;

    fs.readFile(pathToFile, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

            const jsonData = JSON.parse(data);

            if (userId <= 0) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const user = jsonData.find(u => u.id === userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);


    });
});

app.post('/users', async (req, res) => {
    try {
        const newData = req.body;

      
        if (newData.name.length <= 3) {
            return res.status(400).json({ error: 'Name should be more than 3 characters' });
        }

        const data = await fsPromises.readFile(pathToFile, 'utf-8');
        const jsonData = JSON.parse(data);

        newData.id = jsonData.length + 1;

        jsonData.push(newData);

        await fsPromises.writeFile(pathToFile, JSON.stringify(jsonData, null, 2), 'utf-8');

        res.json(newData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});



app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const userId = +id;
    const newData = req.body;

    fs.readFile(pathToFile, 'utf-8', (readErr, data) => {
            const jsonData = JSON.parse(data);
            const userIndex = jsonData.findIndex(user => user.id === userId);

            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            jsonData[userIndex] = { ...jsonData[userIndex], ...newData };

            fs.writeFile(pathToFile, JSON.stringify(jsonData, null, 2), 'utf-8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to file:', writeErr);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.json(jsonData[userIndex]);
            });

    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const userId = +id;

    fs.readFile(pathToFile, 'utf-8', (err, data) => {

            const jsonData = JSON.parse(data);
            const userIndex = jsonData.findIndex(user => user.id === userId);
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }
            const deletedUser = jsonData.splice(userIndex, 1)[0];

            fs.writeFile(pathToFile, JSON.stringify(jsonData, null, 2), 'utf-8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to file:', writeErr);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json({ id: deletedUser.id });
            });

    });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/users`);
});

