import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Eye, Truck, CheckCircle, Clock, Package } from 'lucide-react';

interface OrderManagementProps {
  language: string;
}

export function OrderManagement({ language }: OrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const translations = {
    en: {
      title: 'Order Management',
      orderHistory: 'Order History',
      orderId: 'Order ID',
      customer: 'Customer',
      date: 'Date',
      total: 'Total',
      paid: 'Paid',
      due: 'Due',
      status: 'Status',
      delivery: 'Delivery',
      actions: 'Actions',
      viewDetails: 'View Details',
      confirmDelivery: 'Confirm Delivery',
      orderDetails: 'Order Details',
      productName: 'Product Name',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      delivered: 'Delivered',
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      deliveryConfirmed: 'Delivery Confirmed'
    },
    hi: {
      title: 'ऑर्डर प्रबंधन',
      orderHistory: 'ऑर्डर इतिहास',
      orderId: 'ऑर्डर आईडी',
      customer: 'ग्राहक',
      date: 'दिनांक',
      total: 'कुल',
      paid: 'भुगतान',
      due: 'बकाया',
      status: 'स्थिति',
      delivery: 'डिलीवरी',
      actions: 'कार्य',
      viewDetails: 'विवरण देखें',
      confirmDelivery: 'डिलीवरी पुष्टि करें',
      orderDetails: 'ऑर्डर विवरण',
      productName: 'उत्पाद नाम',
      quantity: 'मात्रा',
      price: 'मूल्य',
      subtotal: 'उप-योग',
      delivered: 'वितरित',
      pending: 'लंबित',
      processing: 'प्रसंस्करण',
      shipped: 'भेजा गया',
      deliveryConfirmed: 'डिलीवरी पुष्टि'
    }
  };

  const t = translations[language];

  const orders = [
    {
      id: 'ORD001',
      customer: 'Rajesh Kumar',
      date: '2024-01-15',
      total: 2340,
      paid: 2340,
      due: 0,
      status: 'delivered',
      delivery: 'delivered',
      items: [
        { name: 'Tata Salt', quantity: 5, price: 25 },
        { name: 'Basmati Rice', quantity: 10, price: 180 },
        { name: 'Turmeric Powder', quantity: 3, price: 45 }
      ]
    },
    {
      id: 'ORD002',
      customer: 'Priya Sharma',
      date: '2024-01-14',
      total: 1890,
      paid: 1000,
      due: 890,
      status: 'pending',
      delivery: 'pending',
      items: [
        { name: 'Mustard Oil', quantity: 8, price: 120 },
        { name: 'Red Chili Powder', quantity: 5, price: 60 }
      ]
    },
    {
      id: 'ORD003',
      customer: 'Amit Singh',
      date: '2024-01-14',
      total: 3200,
      paid: 3200,
      due: 0,
      status: 'processing',
      delivery: 'shipped',
      items: [
        { name: 'Wheat Flour', quantity: 20, price: 85 },
        { name: 'Coconut Oil', quantity: 8, price: 200 }
      ]
    },
    {
      id: 'ORD004',
      customer: 'Sunita Devi',
      date: '2024-01-13',
      total: 1560,
      paid: 1560,
      due: 0,
      status: 'delivered',
      delivery: 'delivered',
      items: [
        { name: 'Biscuits', quantity: 12, price: 30 },
        { name: 'Tata Salt', quantity: 10, price: 25 }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      delivered: { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { className: 'bg-blue-100 text-blue-800', icon: Package },
      shipped: { className: 'bg-purple-100 text-purple-800', icon: Truck }
    };
    
    const style = statusStyles[status] || statusStyles.pending;
    return { className: style.className, icon: style.icon, label: t[status] };
  };

  const confirmDelivery = (orderId: string) => {
    // In a real app, this would make an API call
    console.log(`Confirming delivery for order ${orderId}`);
  };

  return (
    <div className="space-y-6">
      <h2>{t.title}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{t.orderHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.orderId}</TableHead>
                <TableHead>{t.customer}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.total}</TableHead>
                <TableHead>{t.paid}</TableHead>
                <TableHead>{t.due}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.delivery}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                const deliveryBadge = getStatusBadge(order.delivery);
                
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>₹{order.total}</TableCell>
                    <TableCell>₹{order.paid}</TableCell>
                    <TableCell className={order.due > 0 ? 'text-red-600 font-medium' : ''}>
                      ₹{order.due}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusBadge.className}>
                        <statusBadge.icon className="w-3 h-3 mr-1" />
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={deliveryBadge.className}>
                        <deliveryBadge.icon className="w-3 h-3 mr-1" />
                        {deliveryBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {t.viewDetails}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{t.orderDetails} - {order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p><strong>{t.customer}:</strong> {order.customer}</p>
                                  <p><strong>{t.date}:</strong> {order.date}</p>
                                </div>
                                <div>
                                  <p><strong>{t.total}:</strong> ₹{order.total}</p>
                                  <p><strong>{t.due}:</strong> ₹{order.due}</p>
                                </div>
                              </div>
                              
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>{t.productName}</TableHead>
                                    <TableHead>{t.quantity}</TableHead>
                                    <TableHead>{t.price}</TableHead>
                                    <TableHead>{t.subtotal}</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>₹{item.price}</TableCell>
                                      <TableCell>₹{item.quantity * item.price}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {order.delivery === 'shipped' && (
                          <Button 
                            size="sm" 
                            onClick={() => confirmDelivery(order.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {t.confirmDelivery}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}