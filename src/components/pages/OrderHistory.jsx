import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [trackingLoading, setTrackingLoading] = useState({});

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const ordersData = await orderService.getAll();
      setOrders(ordersData);
    } catch (err) {
      setError(err.message || "Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

  const handleTrackingClick = async (trackingNumber, orderId) => {
    if (!trackingNumber) return;
    
    setTrackingLoading(prev => ({ ...prev, [orderId]: true }));
    
    try {
      // Initialize ApperClient for Edge function calls
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const result = await apperClient.functions.invoke("track-shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ trackingNumber })
      });

      if (result.success) {
        toast.success(`Tracking info: ${result.data.status} - ${result.data.location}`);
      } else {
        toast.error(result.error || "Failed to track shipment");
      }
    } catch (err) {
      console.error(`Failed to track shipment ${trackingNumber}:`, err);
      toast.error("Unable to retrieve tracking information");
    } finally {
      setTrackingLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === "all") return true;
    return order.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "orderDate":
        aValue = new Date(a.orderDate);
        bValue = new Date(b.orderDate);
        break;
      case "total":
        aValue = a.total;
        bValue = b.total;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }
    
    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadOrders}
      />
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Order History
        </h1>
        <p className="text-lg text-gray-600">
          Track your orders and view purchase history
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All Orders ({orders.length})
            </Button>
            <Button
              variant={filterStatus === "processing" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("processing")}
            >
              Processing ({orders.filter(o => o.status.toLowerCase() === "processing").length})
            </Button>
            <Button
              variant={filterStatus === "shipped" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("shipped")}
            >
              Shipped ({orders.filter(o => o.status.toLowerCase() === "shipped").length})
            </Button>
            <Button
              variant={filterStatus === "delivered" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("delivered")}
            >
              Delivered ({orders.filter(o => o.status.toLowerCase() === "delivered").length})
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Filter" size={16} />
            <span>Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-1 border border-gray-200 rounded-md bg-white text-gray-700"
            >
              <option value="orderDate-desc">Date (Newest)</option>
              <option value="orderDate-asc">Date (Oldest)</option>
              <option value="total-desc">Amount (High to Low)</option>
              <option value="total-asc">Amount (Low to High)</option>
              <option value="status-asc">Status (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {sortedOrders.length === 0 ? (
        <div className="card p-12 text-center">
          <ApperIcon name="Package" size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filterStatus === "all" ? "No orders found" : `No ${filterStatus} orders`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filterStatus === "all" 
              ? "You haven't placed any orders yet. Start shopping to see your order history here."
              : `You don't have any ${filterStatus} orders at the moment.`
            }
          </p>
          {filterStatus === "all" && (
            <Link to="/">
              <Button variant="primary">
                Start Shopping
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("Id")}
                  >
                    <div className="flex items-center gap-1">
                      Order ID
                      <ApperIcon 
                        name={sortBy === "Id" ? (sortOrder === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        size={12} 
                      />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("orderDate")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ApperIcon 
                        name={sortBy === "orderDate" ? (sortOrder === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        size={12} 
                      />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-1">
                      Total
                      <ApperIcon 
                        name={sortBy === "total" ? (sortOrder === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        size={12} 
                      />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ApperIcon 
                        name={sortBy === "status" ? (sortOrder === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        size={12} 
                      />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">
                        #{order.Id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        {order.items.map((item, index) => (
                          <span key={index}>
                            {item.quantity}x Product #{item.productId}
                            {index < order.items.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.shippingAddress.street}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.trackingNumber ? (
                        <button
                          onClick={() => handleTrackingClick(order.trackingNumber, order.Id)}
                          disabled={trackingLoading[order.Id]}
                          className="text-primary hover:text-primary/80 font-medium text-sm underline flex items-center gap-1 transition-colors"
                        >
                          {trackingLoading[order.Id] ? (
                            <>
                              <ApperIcon name="Loader2" size={12} className="animate-spin" />
                              Tracking...
                            </>
                          ) : (
                            <>
                              <ApperIcon name="ExternalLink" size={12} />
                              {order.trackingNumber}
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">Not available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/order-confirmation/${order.Id}`}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {sortedOrders.map((order, index) => (
              <div 
                key={order.Id} 
                className={`p-6 ${index !== sortedOrders.length - 1 ? "border-b border-gray-200" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.Id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Items:</span>
                    <span className="text-sm text-gray-900">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Shipping:</span>
                    <div className="text-right">
                      <div className="text-sm text-gray-900">{order.shippingAddress.street}</div>
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tracking:</span>
                      <button
                        onClick={() => handleTrackingClick(order.trackingNumber, order.Id)}
                        disabled={trackingLoading[order.Id]}
                        className="text-primary hover:text-primary/80 font-medium text-sm underline flex items-center gap-1"
                      >
                        {trackingLoading[order.Id] ? (
                          <>
                            <ApperIcon name="Loader2" size={12} className="animate-spin" />
                            Tracking...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="ExternalLink" size={12} />
                            {order.trackingNumber}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link 
                    to={`/order-confirmation/${order.Id}`}
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;