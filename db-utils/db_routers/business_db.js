const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes   

// GET / - Get all businesses with pagination
router.get('/', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({ data, count: data.length });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: `Database error: ${error.message}` });
  }
});

// POST / - Create a new business
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;  // Assuming businesses has 'name' field

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert([{ name }])
      .select();

    if (error) throw error;

    res.status(201).json({ data, message: 'Business created successfully' });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /:id - Get a specific business
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Business not found' });
      }
      throw error;
    }

    res.json({ data });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /:id - Update a business
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const { data, error } = await supabase
      .from('businesses')
      .update({ name })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({ data, message: 'Business updated successfully' });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /:id - Delete a business
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
