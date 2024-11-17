const Category = require('../db/models/category');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        
        // Check if category name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }
        
        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save();
        res.status(201).json({ success: true, data: savedCategory });
        
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, message: 'Server error: Failed to create category', error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
      const categories = await Category.find(); // Fetch all categories from the database
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  };

  const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
  
      if (!id) {
        return res.status(400).json({ success: false, message: 'Category ID is required' });
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
  
      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
