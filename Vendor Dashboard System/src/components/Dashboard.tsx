import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';

interface DashboardProps {
  language: string;
}

export function Dashboard({ language }: DashboardProps) {
  const translations = {
    en: {
      title: 'Dashboard Overview',
      totalSales: 'Total Sales',
      pendingOrders: 'Pending Orders',
      completedOrders: 'Completed Orders',
      outstandingDues: 'Outstanding Dues',
      recentOrders: 'Recent Orders',
      quickActions: 'Quick Actions',
      viewProducts: 'View Products',
      newOrder: 'New Order',
      viewReports: 'View Reports',
      announcements: 'Announcements',
      status: 'Status',
      delivered: 'Delivered',
      pending: 'Pending',
      processing: 'Processing'
    },
    hi: {
      title: 'डैशबोर्ड अवलोकन',
      totalSales: 'कुल बिक्री',
      pendingOrders: 'लंबित ऑर्डर',
      completedOrders: 'पूर्ण ऑर्डर',
      outstandingDues: 'बकाया राशि',
      recentOrders: 'हाल के ऑर्डर',
      quickActions: 'त्वरित कार्य',
      viewProducts: 'उत्पाद देखें',
      newOrder: 'नया ऑर्डर',
      viewReports: 'रिपोर्ट देखें',
      announcements: 'घोषणाएं',
      status: 'स्थिति',
      delivered: 'वितरित',
      pending: 'लंबित',
      processing: 'प्रसंस्करण'
    }
  };

  const t = translations[language];

  const metrics = [
    { title: t.totalSales, value: '₹2,45,600', icon: DollarSign, color: 'text-green-600' },
    { title: t.pendingOrders, value: '12', icon: Clock, color: 'text-yellow-600' },
    { title: t.completedOrders, value: '156', icon: CheckCircle, color: 'text-blue-600' },
    { title: t.outstandingDues, value: '₹18,400', icon: AlertCircle, color: 'text-red-600' }
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'Rajesh Kumar', amount: '₹2,340', status: 'delivered', date: '2024-01-15' },
    { id: 'ORD002', customer: 'Priya Sharma', amount: '₹1,890', status: 'pending', date: '2024-01-14' },
    { id: 'ORD003', customer: 'Amit Singh', amount: '₹3,200', status: 'processing', date: '2024-01-14' },
    { id: 'ORD004', customer: 'Sunita Devi', amount: '₹1,560', status: 'delivered', date: '2024-01-13' }
  ];

  const getStatusBadge = (status: string) => {
    const statusColors = {
      delivered: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || statusColors.pending;
  };

  return (
    <div className="space-y-6">
      <h2>{t.title}</h2>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>{t.recentOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <Badge className={getStatusBadge(order.status)}>
                      {t[order.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t.quickActions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <Package className="w-4 h-4 mr-2" />
                {t.viewProducts}
              </Button>
              <Button className="w-full" variant="outline">
                <ShoppingBag className="w-4 h-4 mr-2" />
                {t.newOrder}
              </Button>
              <Button className="w-full" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t.viewReports}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>{t.announcements}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-900">System Maintenance</p>
              <p className="text-sm text-blue-700">Scheduled maintenance on Jan 20, 2024 from 2:00 AM to 4:00 AM</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-900">New Features Available</p>
              <p className="text-sm text-green-700">Voice billing and multi-language support now available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}