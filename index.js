import express  from "express"
import cors from "cors"
import bodyParser from "body-parser"
import fs from "fs"
const app = express()
const port = 4000

app.use(cors()) 
app.use(bodyParser.json())

app.get('/', (req, res) => { 
    res.send('Hello World!')
})

app.post('/', (req, res) => {
    const newData = req.body; // New form submission

    // Read existing file data (if any)
    fs.readFile('data.json', 'utf8', (err, fileData) => {
        let jsonData;

        if (err) {
            if (err.code === 'ENOENT') {
                // If the file doesn't exist, initialize it as an empty array
                console.log('data.json does not exist, creating a new file.');
                jsonData = [];
            } else {
                console.error('Error reading file:', err);
                return res.status(500).send('Error reading data file');
            }
        } else {
            try {
                // Try to parse the existing data as JSON
                jsonData = JSON.parse(fileData);
                if (!Array.isArray(jsonData)) {
                    // If the JSON is valid but not an array, initialize it as an array
                    console.log('Existing data is not an array, resetting to an empty array.');
                    jsonData = [];
                }
            } catch (parseErr) {
                // If parsing fails, treat the file as empty
                console.error('Error parsing JSON:', parseErr);
                jsonData = [];
            }
        }

        // Append the new data to the array
        jsonData.push(newData);

        // Write the updated array back to the file
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to file:', writeErr);
                return res.status(500).send('Error saving data to file');
            }
            console.log('Data appended successfully');
            res.send('Message sent successfully');
        });
    });
});


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})