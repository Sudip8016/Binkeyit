import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        if (!userId) {
            return response.status(401).json({
                message: " Please login.",
                error: true,
                success: false
            });
        }

        if (!productId) {
            return response.status(400).json({
                message: "Provide productId",
                error: true,
                success: false
            });
        }

        const checkItemCart = await CartProductModel.findOne({ userId, productId });

        if (checkItemCart) {
            return response.status(400).json({
                message: "Item already in cart",
                error: true,
                success: false
            });
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId,
            productId
        });

        const save = await cartItem.save();

        await UserModel.updateOne({ _id: userId }, {
            $push: { shopping_cart: productId }
        });

        return response.status(200).json({
            data: save,
            message: "Item added successfully",
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error in addToCartItemController:', error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};


export const getCartItemController = async(request,response)=>{
    try {
        const userId = request.userId

        const cartItem =  await CartProductModel.find({
            userId : userId
        }).populate('productId')

        return response.json({
            data : cartItem,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateCartItemQtyController = async(request,response)=>{
    try {
        const userId = request.userId 
        const { _id,qty } = request.body

        if(!_id ||  !qty){
            return response.status(400).json({
                message : "provide _id, qty"
            })
        }

        const updateCartitem = await CartProductModel.updateOne({
            _id : _id,
            userId : userId
        },{
            quantity : qty
        })

        return response.json({
            message : "Update cart",
            success : true,
            error : false, 
            data : updateCartitem
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCartItemQtyController = async(request,response)=>{
    try {
      const userId = request.userId // middleware
      const { _id } = request.body 
      
      if(!_id){
        return response.status(400).json({
            message : "Provide _id",
            error : true,
            success : false
        })
      }

      const deleteCartItem  = await CartProductModel.deleteOne({_id : _id, userId : userId })

      return response.json({
        message : "Item remove",
        error : false,
        success : true,
        data : deleteCartItem
      })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

