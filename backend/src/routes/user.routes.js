import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    toggleUserStatus, 
    deleteUser,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getWishlist,
    toggleWishlist 
} from '../controllers/user.controller.js';
// Middleware kiểm tra login và quyền Admin
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

router.use(verifyToken); 
router.get('/wishlist', getWishlist);
router.post('/wishlist/toggle', toggleWishlist);
router.get('/', getAllUsers);
router.put('/:id/status', toggleUserStatus);
router.delete('/:id', deleteUser);
router.post('/address', addAddress);
router.put('/address/:addressId', updateAddress);
router.delete('/address/:addressId', deleteAddress);
router.put('/address/:addressId/default', setDefaultAddress);
router.get('/:id', getUserById);

export default router;