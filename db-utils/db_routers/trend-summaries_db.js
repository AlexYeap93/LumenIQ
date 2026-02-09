const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes

// GET / - Get all trend summaries with pagination
router.get('/', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const { data, error } = await supabase
      .from('trend_summaries')
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({ data, count: data.length });
  } catch (error) {
    console.error('Error fetching trend summaries:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST / - Create a new trend summary
router.post('/', async (req, res) => {
  try {
    const { business_id, stage_run_id, summary } = req.body;

    if (!business_id || !summary) {
      return res.status(400).json({ error: 'business_id and summary are required' });
    }

    const { data, error } = await supabase
      .from('trend_summaries')
      .insert([{ business_id, stage_run_id, summary }])
      .select();

    if (error) throw error;

    res.status(201).json({ data, message: 'Trend summary created successfully' });
  } catch (error) {
    console.error('Error creating trend summary:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /:id - Get a specific trend summary
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('trend_summaries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Trend summary not found' });
      }
      throw error;
    }

    res.json({ data });
  } catch (error) {
    console.error('Error fetching trend summary:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /:id - Update a trend summary
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { business_id, stage_run_id, summary } = req.body;

    const { data, error } = await supabase
      .from('trend_summaries')
      .update({ business_id, stage_run_id, summary })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'Trend summary not found' });
    }

    res.json({ data, message: 'Trend summary updated successfully' });
  } catch (error) {
    console.error('Error updating trend summary:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /:id - Delete a trend summary
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('trend_summaries')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'Trend summary not found' });
    }

    res.json({ message: 'Trend summary deleted successfully' });
  } catch (error) {
    console.error('Error deleting trend summary:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;