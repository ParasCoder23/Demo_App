import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Item } from './types/Item';
import { api } from './services/api';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    name: '',
    description: '',
    price: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.getItems();
      setItems(response.data);
      // if (response.data.length > 0) {
      //   toast.success('Items loaded successfully!');
      // }
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items. Please try again.');
    }
  };

  const handleOpen = (item?: Item) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedItem) {
        await api.updateItem(selectedItem.id!, formData);
        toast.success('Item updated successfully!');
      } else {
        await api.createItem(formData);
        toast.success('Item created successfully!');
      }
      fetchItems();
      handleClose();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(`Failed to ${selectedItem ? 'update' : 'create'} item. Please try again.`);
    }
  };

  const handleDelete = async (id: number, itemName: string) => {
    // if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        await api.deleteItem(id);
        toast.success('Item deleted successfully!');
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item. Please try again.');
      }
    // }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Item Management System (Demo Version)
          </Typography>
          <Chip label={`${items.length} Items`} color="primary" size="medium" />
        </Box>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ mb: 3, borderRadius: 2, px: 3, py: 1.5 }}
        >
          Add New Item
        </Button>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>Description</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>Price</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      No items found. Add your first item to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
                      '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium', fontSize: '1rem' }}>{item.name}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`$${item.price.toFixed(2)}`} 
                        color="success" 
                        variant="outlined" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(item)}
                          sx={{ '&:hover': { backgroundColor: 'primary.light' } }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item.id!, item.name)}
                          sx={{ '&:hover': { backgroundColor: 'error.light' } }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog 
          open={open} 
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', fontSize: '1.5rem' }}>
            {selectedItem ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              variant="outlined"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              variant="outlined"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              margin="normal"
              variant="outlined"
              required
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              size="large"
              sx={{ borderRadius: 2, px: 3 }}
              disabled={!formData.name.trim() || !formData.description.trim() || formData.price <= 0}
            >
              {selectedItem ? 'Update Item' : 'Create Item'}
            </Button>
          </DialogActions>
        </Dialog>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Box>
    </Container>
  );
}

export default App;
