import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RotateCcw, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReturnManagementProps {
  language: string;
}

export function ReturnManagement({ language }: ReturnManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');

  const translations = {
    en: {
      title: 'Return Management',
      returnHistory: 'Return History',
      initiateReturn: 'Initiate Return',
      returnId: 'Return ID',
      orderId: 'Order ID',
      customer: 'Customer',
      date: 'Date',
      amount: 'Amount',
      status: 'Status',
      selectOrder: 'Select Order',
      productName: 'Product Name',
      orderedQty: 'Ordered Qty',
      returnQty: 'Return Qty',
      reason: 'Reason',
      submitReturn: 'Submit Return',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      processing: 'Processing',
      defectiveProduct: 'Defective Product',
      wrongItem: 'Wrong Item Received',
      notRequired: 'Not Required',
      damagedPackaging: 'Damaged Packaging',
      returnSubmitted: 'Return request submitted successfully'
    },
    hi: {
      title: 'रिटर्न प्रबंधन',
      returnHistory: 'रिटर्न इतिहास',
      initiateReturn: 'रिटर्न शुरू करें',
      returnId: 'रिटर्न आईडी',
      orderId: 'ऑर्डर आईडी',
      customer: 'ग्राहक',
      date: 'दिनांक',
      amount: 'राशि',
      status: 'स्थिति',
      selectOrder: 'ऑर्डर चुनें',
      productName: 'उत्पाद नाम',
      orderedQty: 'ऑर्डर मात्रा',
      returnQty: 'रिटर्न मात्रा',
      reason: 'कारण',
      submitReturn: 'रिटर्न सबमिट करें',
      pending: 'लंबित',
      approved: 'मंजूर',
      rejected: 'अस्वीकृत',
      processing: 'प्रसंस्करण',
      defectiveProduct: 'खराब उत्पाद',
      wrongItem: 'गलत आइटम मिला',
      notRequired: 'आवश्यक नहीं',
      damagedPackaging: 'क्षतिग्रस्त पैकेजिंग',
      returnSubmitted: 'रिटर्न अनुरोध सफलतापूर्वक सबमिट किया गया'
    }
  };

  const t = translations[language];

  const returns = [
    {
      id: 'RET001',
      orderId: 'ORD001',
      customer: 'Rajesh Kumar',
      date: '2024-01-16',
      amount: 270,
      status: 'approved',
      items: [{ name: 'Tata Salt', quantity: 2, reason: 'Defective Product' }]
    },
    {
      id: 'RET002',
      orderId: 'ORD002',
      customer: 'Priya Sharma',
      date: '2024-01-15',
      amount: 180,
      status: 'pending',
      items: [{ name: 'Red Chili Powder', quantity: 3, reason: 'Wrong Item Received' }]
    },
    {
      id: 'RET003',
      orderId: 'ORD003',
      customer: 'Amit Singh',
      date: '2024-01-14',
      amount: 400,
      status: 'processing',
      items: [{ name: 'Coconut Oil', quantity: 2, reason: 'Damaged Packaging' }]
    }
  ];

  const availableOrders = [
    {
      id: 'ORD001',
      customer: 'Rajesh Kumar',
      items: [
        { name: 'Tata Salt', orderedQty: 5, price: 25 },
        { name: 'Basmati Rice', orderedQty: 10, price: 180 },
        { name: 'Turmeric Powder', orderedQty: 3, price: 45 }
      ]
    },
    {
      id: 'ORD004',
      customer: 'Sunita Devi',
      items: [
        { name: 'Biscuits', orderedQty: 12, price: 30 },
        { name: 'Tata Salt', orderedQty: 10, price: 25 }
      ]
    }
  ];

  const returnReasons = [
    { value: 'defective', label: t.defectiveProduct },
    { value: 'wrong_item', label: t.wrongItem },
    { value: 'not_required', label: t.notRequired },
    { value: 'damaged', label: t.damagedPackaging }
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      approved: { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      rejected: { className: 'bg-red-100 text-red-800', icon: XCircle },
      processing: { className: 'bg-blue-100 text-blue-800', icon: Clock }
    };
    
    const style = statusStyles[status] || statusStyles.pending;
    return { className: style.className, icon: style.icon, label: t[status] };
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
    const order = availableOrders.find(o => o.id === orderId);
    if (order) {
      setReturnItems(order.items.map(item => ({
        ...item,
        returnQty: 0,
        reason: ''
      })));
    }
  };

  const updateReturnItem = (index: number, field: string, value: any) => {
    const updatedItems = [...returnItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setReturnItems(updatedItems);
  };

  const submitReturn = () => {
    const validItems = returnItems.filter(item => item.returnQty > 0 && item.reason);
    
    if (validItems.length === 0) {
      toast.error('Please select items to return with quantities and reasons');
      return;
    }
    
    // In a real app, this would make an API call
    console.log('Submitting return:', { orderId: selectedOrder, items: validItems, reason: returnReason });
    toast.success(t.returnSubmitted);
    
    // Reset form
    setSelectedOrder('');
    setReturnItems([]);
    setReturnReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>{t.title}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t.initiateReturn}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{t.initiateReturn}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.selectOrder}</label>
                <Select value={selectedOrder} onValueChange={handleOrderSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectOrder} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOrders.map(order => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - {order.customer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {returnItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Select Items to Return</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.productName}</TableHead>
                        <TableHead>{t.orderedQty}</TableHead>
                        <TableHead>{t.returnQty}</TableHead>
                        <TableHead>{t.reason}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.orderedQty}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max={item.orderedQty}
                              value={item.returnQty}
                              onChange={(e) => updateReturnItem(index, 'returnQty', parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={item.reason} 
                              onValueChange={(value) => updateReturnItem(index, 'reason', value)}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {returnReasons.map(reason => (
                                  <SelectItem key={reason.value} value={reason.value}>
                                    {reason.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Additional Comments</label>
                <Textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Any additional comments about the return..."
                  rows={3}
                />
              </div>

              <Button onClick={submitReturn} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t.submitReturn}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.returnHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.returnId}</TableHead>
                <TableHead>{t.orderId}</TableHead>
                <TableHead>{t.customer}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.amount}</TableHead>
                <TableHead>{t.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.map((returnItem) => {
                const statusBadge = getStatusBadge(returnItem.status);
                
                return (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">{returnItem.id}</TableCell>
                    <TableCell>{returnItem.orderId}</TableCell>
                    <TableCell>{returnItem.customer}</TableCell>
                    <TableCell>{returnItem.date}</TableCell>
                    <TableCell>₹{returnItem.amount}</TableCell>
                    <TableCell>
                      <Badge className={statusBadge.className}>
                        <statusBadge.icon className="w-3 h-3 mr-1" />
                        {statusBadge.label}
                      </Badge>
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