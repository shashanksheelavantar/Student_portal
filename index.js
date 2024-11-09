const express = require('express');
const app = express();
const pool = require('./database');
app.use(express.json());



app.get('/api/person', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM person'); // Use pool instead of client
    // Format the response for plain text
    let response = `              person_uid              | first_name | last_name | gender |           email            | date_of_birth | country_of_birth | car_uid \n`;
    response += `--------------------------------------+------------+-----------+--------+----------------------------+---------------+------------------+---------\n`;
    
    // Add rows to the response
    result.rows.forEach(row => {
      response += ` ${row.person_uid} | ${row.first_name.padEnd(11)} | ${row.last_name.padEnd(10)} | ${row.gender.padEnd(6)} | ${row.email || 'NULL'.padEnd(26)} | ${row.date_of_birth} | ${row.country_of_birth.padEnd(16)} | ${row.car_uid || 'NULL'} \n`;
    });

    response += `(${result.rows.length} rows)\n`;

    // Set the response type to text and send
    res.setHeader('Content-Type', 'text/plain');
    res.send(response);
  } catch (err) {
    console.error('Error fetching person data', err.stack);
    res.status(500).send('Server Error');
  }
});

app.get('/questions-with-options', async (req, res) => {
  try {
    // Join query to fetch questions along with options
    const query = `
    SELECT q.question_id, q.question, o.option1, o.option2, o.option3, o.option4, o.correct_answer
    FROM question AS q
    INNER JOIN options AS o ON q.question_id = o.question_id;
`;


    const result = await pool.query(query);
    res.status(200).json(result.rows); // Send the result as a JSON response
  } catch (error) {
    console.error('Error fetching questions and options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/add-question-with-options', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing.' });
  }

  const { question, options, correct_answer } = req.body; // Destructure question, options, and correct_answer from the request body

  // Check if the question is provided and options is an array with at least one option
  if (!question || !Array.isArray(options) || options.length < 1 || !correct_answer) {
    return res.status(400).json({ error: 'Question text is required, must have at least one option, and correct_answer is required.' });
  }

  const client = await pool.connect(); // Get a client from the pool
  try {
    await client.query('BEGIN'); // Start a transaction

    // Insert the new question into the question table
    const questionQuery = `
      INSERT INTO question (question)
      VALUES ($1)
      RETURNING question_id; 
    `;
    const questionResult = await client.query(questionQuery, [question]);
    const questionId = questionResult.rows[0].question_id; // Get the id of the newly inserted question

    // Insert the options into the options table
    const optionsQuery = `
      INSERT INTO options (question_id, option1, option2, option3, option4, correct_answer)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    await client.query(optionsQuery, [questionId, ...options, correct_answer]);

    await client.query('COMMIT'); // Commit the transaction

    // Send a response back with the inserted question and options
    res.status(201).json({ message: 'Question and options added successfully', questionId });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    console.error('Error inserting question and options:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release(); // Release the client back to the pool
  }
});





app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
