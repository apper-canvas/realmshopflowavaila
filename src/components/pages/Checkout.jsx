import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useCart } from "@/hooks/useCart";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA"
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    sameAsShipping: true
  });

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const requiredFields = ["firstName", "lastName", "email", "address", "city", "state", "zipCode"];
    const isValid = requiredFields.every(field => shippingInfo[field].trim() !== "");
    
    if (isValid) {
      setStep(2);
    } else {
      toast.error("Please fill in all required shipping information");
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const requiredFields = ["cardNumber", "expiryDate", "cvv", "cardholderName"];
    const isValid = requiredFields.every(field => paymentInfo[field].trim() !== "");
    
    if (isValid) {
      setStep(3);
    } else {
      toast.error("Please fill in all required payment information");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions
        })),
        total: finalTotal,
        status: "Processing",
        shippingAddress: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        },
        paymentMethod: "Credit Card"
      };

      const order = await orderService.create(orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.Id}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
            stepNumber <= step 
              ? "bg-primary text-white" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {stepNumber < step ? (
              <ApperIcon name="Check" size={20} />
            ) : (
              stepNumber
            )}
          </div>
          {stepNumber < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              stepNumber < step ? "bg-primary" : "bg-gray-200"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderShippingStep = () => (
    <form onSubmit={handleShippingSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <Input
            value={shippingInfo.firstName}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <Input
            value={shippingInfo.lastName}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={shippingInfo.email}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Input
            type="tel"
            value={shippingInfo.phone}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <Input
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Enter your street address"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <Input
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Enter city"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <Input
            value={shippingInfo.state}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
            placeholder="Enter state"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code *
          </label>
          <Input
            value={shippingInfo.zipCode}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
            placeholder="Enter ZIP code"
            required
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        Continue to Payment
        <ApperIcon name="ArrowRight" size={20} className="ml-2" />
      </Button>
    </form>
  );

  const renderPaymentStep = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number *
        </label>
        <Input
          value={paymentInfo.cardNumber}
          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date *
          </label>
          <Input
            value={paymentInfo.expiryDate}
            onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
            placeholder="MM/YY"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV *
          </label>
          <Input
            value={paymentInfo.cvv}
            onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
            placeholder="123"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name *
        </label>
        <Input
          value={paymentInfo.cardholderName}
          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardholderName: e.target.value }))}
          placeholder="Enter cardholder name"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setStep(1)}
          size="lg"
          className="flex-1"
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to Shipping
        </Button>
        <Button type="submit" size="lg" className="flex-1">
          Review Order
          <ApperIcon name="ArrowRight" size={20} className="ml-2" />
        </Button>
      </div>
    </form>
  );

  const renderReviewStep = () => (
    <div className="space-y-8">
      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={item.product.images?.[0]}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.product.name}</h4>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <span className="font-semibold text-gray-900">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p>{shippingInfo.address}</p>
            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
            <p className="mt-2 text-sm text-gray-600">{shippingInfo.email}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">Credit Card</p>
            <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
            <p className="text-sm text-gray-600">{paymentInfo.cardholderName}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setStep(2)}
          size="lg"
          className="flex-1"
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to Payment
        </Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={loading}
          size="lg"
          className="flex-1"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader" size={20} className="mr-2 animate-spin" />
              Placing Order...
            </>
          ) : (
            <>
              <ApperIcon name="CreditCard" size={20} className="mr-2" />
              Place Order
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Shipping Information
                  </h2>
                  {renderShippingStep()}
                </>
              )}
              
              {step === 2 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Payment Information
                  </h2>
                  {renderPaymentStep()}
                </>
              )}
              
              {step === 3 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Review Your Order
                  </h2>
                  {renderReviewStep()}
                </>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-elevated p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Total
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="gradient-text">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Shield" size={14} />
                  <span>SSL Secured Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Truck" size={14} />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="RotateCcw" size={14} />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;