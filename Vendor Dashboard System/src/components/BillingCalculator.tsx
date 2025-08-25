import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calculator, Mic, History, Download, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BillingCalculatorProps {
  language: string;
}

export function BillingCalculator({ language }: BillingCalculatorProps) {
  const [calculatorMode, setCalculatorMode] = useState('manual'); // 'manual' or 'voice'
  const [currentCalculation, setCurrentCalculation] = useState('');
  const [result, setResult] = useState('');
  const [billingItems, setBillingItems] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const translations = {
    en: {
      title: 'Billing & Calculator',
      calculator: 'Calculator',
      billing: 'Billing',
      manualMode: 'Manual Mode',
      voiceMode: 'Voice Mode',
      calculation: 'Calculation',
      result: 'Result',
      clear: 'Clear',
      calculate: 'Calculate',
      addToBill: 'Add to Bill',
      currentBill: 'Current Bill',
      item: 'Item',
      amount: 'Amount',
      total: 'Total',
      payment: 'Payment',
      paymentAmount: 'Payment Amount',
      paymentMethod: 'Payment Method',
      cash: 'Cash',
      upi: 'UPI',
      processPayment: 'Process Payment',
      generateInvoice: 'Generate Invoice',
      calculationHistory: 'Calculation History',
      outstanding: 'Outstanding',
      paid: 'Paid',
      paymentProcessed: 'Payment processed successfully',
      invoiceGenerated: 'Invoice generated successfully'
    },
    hi: {
      title: 'बिलिंग और कैलकुलेटर',
      calculator: 'कैलकुलेटर',
      billing: 'बिलिंग',
      manualMode: 'मैनुअल मोड',
      voiceMode: 'वॉयस मोड',
      calculation: 'गणना',
      result: 'परिणाम',
      clear: 'साफ़ करें',
      calculate: 'गणना करें',
      addToBill: 'बिल में जोड़ें',
      currentBill: 'वर्तमान बिल',
      item: 'आइटम',
      amount: 'राशि',
      total: 'कुल',
      payment: 'भुगतान',
      paymentAmount: 'भुगतान राशि',
      paymentMethod: 'भुगतान विधि',
      cash: 'नकद',
      upi: 'यूपीआई',
      processPayment: 'भुगतान प्रक्रिया',
      generateInvoice: 'चालान जेनरेट करें',
      calculationHistory: 'गणना इतिहास',
      outstanding: 'बकाया',
      paid: 'भुगतान',
      paymentProcessed: 'भुगतान सफलतापूर्वक प्रसंस्कृत',
      invoiceGenerated: 'चालान सफलतापूर्वक जेनरेट किया गया'
    }
  };

  const t = translations[language];

  const [calculationHistory, setCalculationHistory] = useState([
    { calculation: '25 * 10', result: '250', timestamp: '2024-01-15 10:30' },
    { calculation: '180 + 45', result: '225', timestamp: '2024-01-15 10:25' },
    { calculation: '120 * 8', result: '960', timestamp: '2024-01-15 10:20' }
  ]);

  const calculatorButtons = [
    ['C', '/', '*', '←'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '=']
  ];

  const handleCalculatorInput = (value: string) => {
    if (value === 'C') {
      setCurrentCalculation('');
      setResult('');
    } else if (value === '←') {
      setCurrentCalculation(currentCalculation.slice(0, -1));
    } else if (value === '=') {
      try {
        const calcResult = eval(currentCalculation).toString();
        setResult(calcResult);
        
        // Add to history
        const newHistoryItem = {
          calculation: currentCalculation,
          result: calcResult,
          timestamp: new Date().toLocaleString()
        };
        setCalculationHistory([newHistoryItem, ...calculationHistory]);
      } catch (error) {
        setResult('Error');
      }
    } else {
      setCurrentCalculation(currentCalculation + value);
    }
  };

  const addToBill = () => {
    if (result && currentCalculation) {
      const newItem = {
        id: Date.now(),
        description: currentCalculation,
        amount: parseFloat(result)
      };
      setBillingItems([...billingItems, newItem]);
      setCurrentCalculation('');
      setResult('');
    }
  };

  const getTotalBill = () => {
    return billingItems.reduce((total, item) => total + item.amount, 0);
  };

  const processPayment = () => {
    if (!paymentAmount || !paymentMethod) {
      toast.error('Please enter payment amount and method');
      return;
    }
    
    toast.success(t.paymentProcessed);
    setPaymentAmount('');
    setPaymentMethod('');
  };

  const generateInvoice = () => {
    toast.success(t.invoiceGenerated);
  };

  return (
    <div className="space-y-6">
      <h2>{t.title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t.calculator}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={calculatorMode === 'manual' ? 'default' : 'outline'}
                  onClick={() => setCalculatorMode('manual')}
                >
                  <Calculator className="w-4 h-4 mr-1" />
                  {t.manualMode}
                </Button>
                <Button
                  size="sm"
                  variant={calculatorMode === 'voice' ? 'default' : 'outline'}
                  onClick={() => setCalculatorMode('voice')}
                >
                  <Mic className="w-4 h-4 mr-1" />
                  {t.voiceMode}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t.calculation}</label>
                <Input
                  value={currentCalculation}
                  onChange={(e) => setCurrentCalculation(e.target.value)}
                  className="text-right text-lg"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t.result}</label>
                <Input
                  value={result}
                  readOnly
                  className="text-right text-xl font-bold bg-gray-50"
                  placeholder="0"
                />
              </div>

              {calculatorMode === 'manual' && (
                <div className="grid grid-cols-4 gap-2">
                  {calculatorButtons.flat().map((button, index) => (
                    <Button
                      key={index}
                      variant={['C', '='].includes(button) ? 'default' : 'outline'}
                      onClick={() => handleCalculatorInput(button)}
                      className="h-12"
                    >
                      {button}
                    </Button>
                  ))}
                </div>
              )}

              {calculatorMode === 'voice' && (
                <div className="text-center py-8">
                  <Mic className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                  <p className="text-muted-foreground">Voice input mode active</p>
                  <Button className="mt-4">Start Voice Input</Button>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={addToBill} className="flex-1" disabled={!result}>
                  {t.addToBill}
                </Button>
                <Button onClick={() => { setCurrentCalculation(''); setResult(''); }} variant="outline">
                  {t.clear}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle>{t.billing}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">{t.currentBill}</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {billingItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.description}</span>
                      <span className="font-medium">₹{item.amount}</span>
                    </div>
                  ))}
                  {billingItems.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No items in bill</p>
                  )}
                </div>
                
                {billingItems.length > 0 && (
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>{t.total}:</span>
                      <span>₹{getTotalBill()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">{t.payment}</h4>
                <Input
                  type="number"
                  placeholder={t.paymentAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
                
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.paymentMethod} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center">
                        <Banknote className="w-4 h-4 mr-2" />
                        {t.cash}
                      </div>
                    </SelectItem>
                    <SelectItem value="upi">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        {t.upi}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Button onClick={processPayment} className="flex-1">
                    {t.processPayment}
                  </Button>
                  <Button onClick={generateInvoice} variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    {t.generateInvoice}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation History */}
      <Card>
        <CardHeader>
          <CardTitle>
            <History className="w-5 h-5 mr-2 inline" />
            {t.calculationHistory}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {calculationHistory.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.calculation} = {item.result}</p>
                  <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentCalculation(item.calculation);
                    setResult(item.result);
                  }}
                >
                  Use
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}