import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { orderService } from "@/services/api/orderService";
import { productService } from "@/services/api/productService";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      
      const orderData = await orderService.getById(orderId);
      setOrder(orderData);
      
      // Load product details for each item
      const itemsWithProducts = await Promise.all(
        orderData.items.map(async (item) => {
          try {
            const product = await productService.getById(item.productId);
            return { ...item, product };
          } catch (err) {
            return { ...item, product: null };
          }
        })
      );
      
      setOrderItems(itemsWithProducts);
    } catch (err) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container py-8">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-8">
        <Error 
          message={error || "Order not found"} 
          onRetry={loadOrder}
        />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "info";
      case "shipped":
        return "warning";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-success to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CheckCircle" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-lg text-gray-500">
            Order ID: <span className="font-semibold text-primary">#{order.Id}</span>
          </p>
        </div>

        {/* Order Status */}
        <div className="card p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${order.total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Order Total</div>
            </div>
            <div>
              <Badge variant={getStatusColor(order.status)} className="mb-2 text-base px-4 py-2">
                {order.status}
              </Badge>
              <div className="text-sm text-gray-600">Order Status</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {new Date(order.estimatedDelivery).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Expected Delivery</div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Order Items ({orderItems.length})
          </h2>
          
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {item.product ? (
                  <>
                    <img
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {item.product.brand}
                      </p>
                      <p className="text-lg font-bold text-primary mt-1">
                        ${item.product.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 p-4 text-center text-gray-500">
                    Product information unavailable
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="MapPin" size={20} className="mr-2 text-primary" />
              Shipping Address
            </h3>
            <div className="text-gray-600 space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="CreditCard" size={20} className="mr-2 text-primary" />
              Payment Method
            </h3>
            <div className="text-gray-600">
              <p>{order.paymentMethod}</p>
              <p className="text-sm mt-2">
                Order placed on {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            What happens next?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Package" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Processing</h4>
                <p className="text-sm text-gray-600">
                  We're preparing your items for shipment. You'll receive an update within 24 hours.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Truck" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Shipping</h4>
                <p className="text-sm text-gray-600">
                  Once shipped, you'll receive a tracking number to monitor your package.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Home" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
                <p className="text-sm text-gray-600">
                  Your order will be delivered by {new Date(order.estimatedDelivery).toLocaleDateString()}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            <ApperIcon name="Download" size={20} className="mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;