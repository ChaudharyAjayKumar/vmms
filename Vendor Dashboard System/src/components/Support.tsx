import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SupportProps {
  language: string;
}

export function Support({ language }: SupportProps) {
  const [supportMessage, setSupportMessage] = useState("");
  const [contactSubject, setContactSubject] = useState("");

  const translations = {
    en: {
      title: "Support & Help",
      announcements: "Announcements",
      faq: "Frequently Asked Questions",
      contactSupport: "Contact Support",
      helpCenter: "Help Center",
      subject: "Subject",
      message: "Message",
      sendMessage: "Send Message",
      callSupport: "Call Support",
      emailSupport: "Email Support",
      liveChat: "Live Chat",
      messageSent:
        "Message sent successfully. We will respond within 24 hours.",
      systemMaintenance: "System Maintenance",
      newFeatures: "New Features",
      important: "Important",
      general: "General",
      howToAddProduct: "How do I add products to my cart?",
      howToAddProductAnswer:
        'Navigate to the Products section, search for items, and click "Add to Cart". You can toggle between unit and box pricing.',
      howToTrackOrder: "How can I track my orders?",
      howToTrackOrderAnswer:
        "Go to the Orders section to view all your orders and their delivery status. You can also confirm delivery for shipped orders.",
      howToReturn: "How do I return items?",
      howToReturnAnswer:
        "Visit the Returns section, select the order, choose items to return with quantities and reasons, then submit the return request.",
      howToPayment: "What payment methods are supported?",
      howToPaymentAnswer:
        "We support both Cash and UPI payments. You can process payments in the Billing section.",
      howToVoice: "How does voice billing work?",
      howToVoiceAnswer:
        "Enable voice mode in the calculator or header, then speak your calculations in Hindi or English.",
    },
    hi: {
      title: "सहायता और मदद",
      announcements: "घोषणाएं",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      contactSupport: "सहायता संपर्क",
      helpCenter: "सहायता केंद्र",
      subject: "विषय",
      message: "संदेश",
      sendMessage: "संदेश भेजें",
      callSupport: "सहायता कॉल करें",
      emailSupport: "ईमेल सहायता",
      liveChat: "लाइव चैट",
      messageSent:
        "संदेश सफलतापूर्वक भेजा गया। हम 24 घंटे के भीतर जवाब देंगे।",
      systemMaintenance: "सिस्टम रखरखाव",
      newFeatures: "नई सुविधाएं",
      important: "महत्वपूर्ण",
      general: "सामान्य",
      howToAddProduct: "मैं अपने कार्ट में उत्पाद कैसे जोड़ूं?",
      howToAddProductAnswer:
        'उत्पाद अनुभाग पर जाएं, आइटम खोजें, और "कार्ट में जोड़ें" पर क्लिक करें। आप यूनिट और बॉक्स मूल्य के बीच टॉगल कर सकते हैं।',
      howToTrackOrder:
        "मैं अपने ऑर्डर को कैसे ट्रैक कर सकता हूं?",
      howToTrackOrderAnswer:
        "अपने सभी ऑर्डर और उनकी डिलीवरी स्थिति देखने के लिए ऑर्डर अनुभाग पर जाएं। आप भेजे गए ऑर्डर के लिए डिलीवरी की पुष्टि भी कर सकते हैं।",
      howToReturn: "मैं आइटम कैसे वापस करूं?",
      howToReturnAnswer:
        "रिटर्न अनुभाग पर जाएं, ऑर्डर का चयन करें, मात्रा और कारणों के साथ वापसी के लिए आइटम चुनें, फिर रिटर्न अनुरोध सबमिट करें।",
      howToPayment: "कौन से भुगतान विधियां समर्थित हैं?",
      howToPaymentAnswer:
        "हम नकद और यूपीआई दोनों भुगतान का समर्थन करते हैं। आप बिलिंग अनुभाग में भुगतान प्रक्रिया कर सकते हैं।",
      howToVoice: "वॉयस बिलिंग कैसे काम करती है?",
      howToVoiceAnswer:
        "कैलकुलेटर या हेडर में वॉयस मोड सक्षम करें, फिर हिंदी या अंग्रेजी में अपनी गणना बोलें।",
    },
  };

  const t = translations[language];

  const announcements = [
    {
      id: 1,
      type: "maintenance",
      title: "Scheduled System Maintenance",
      message:
        "System will be down for maintenance on Jan 20, 2024 from 2:00 AM to 4:00 AM IST.",
      date: "2024-01-18",
      priority: "important",
    },
    {
      id: 2,
      type: "feature",
      title: "New Voice Billing Feature",
      message:
        "Voice billing in Hindi and English is now available. Enable it from the header or calculator.",
      date: "2024-01-15",
      priority: "general",
    },
    {
      id: 3,
      type: "general",
      title: "Mobile App Coming Soon",
      message:
        "Our mobile application will be launching next month with enhanced features.",
      date: "2024-01-10",
      priority: "general",
    },
  ];

  const faqItems = [
    {
      question: t.howToAddProduct,
      answer: t.howToAddProductAnswer,
    },
    {
      question: t.howToTrackOrder,
      answer: t.howToTrackOrderAnswer,
    },
    {
      question: t.howToReturn,
      answer: t.howToReturnAnswer,
    },
    {
      question: t.howToPayment,
      answer: t.howToPaymentAnswer,
    },
    {
      question: t.howToVoice,
      answer: t.howToVoiceAnswer,
    },
  ];

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return AlertTriangle;
      case "feature":
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getAnnouncementStyle = (priority: string) => {
    switch (priority) {
      case "important":
        return "border-red-200 bg-red-50";
      case "general":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const sendSupportMessage = () => {
    if (!contactSubject || !supportMessage) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success(t.messageSent);
    setContactSubject("");
    setSupportMessage("");
  };

  return (
    <div className="space-y-6">
      <h2>{t.title}</h2>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Megaphone className="w-5 h-5 mr-2 inline" />
            {t.announcements}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => {
              const Icon = getAnnouncementIcon(
                announcement.type,
              );
              return (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-lg border ${getAnnouncementStyle(announcement.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {announcement.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              announcement.priority ===
                              "important"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {t[announcement.priority]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {announcement.date}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">
                        {announcement.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>
              <HelpCircle className="w-5 h-5 mr-2 inline" />
              {t.faq}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              collapsible
              className="space-y-2"
            >
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>{t.contactSupport}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Quick Contact Options */}
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t.callSupport}: +91 1800-123-456
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t.emailSupport}: support@vendor.com
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.liveChat}
                </Button>
              </div>

              {/* Contact Form */}
              <div className="border-t pt-4 space-y-3">
                <Input
                  placeholder={t.subject}
                  value={contactSubject}
                  onChange={(e) =>
                    setContactSubject(e.target.value)
                  }
                />
                <Textarea
                  placeholder={t.message}
                  value={supportMessage}
                  onChange={(e) =>
                    setSupportMessage(e.target.value)
                  }
                  rows={4}
                />
                <Button
                  onClick={sendSupportMessage}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t.sendMessage}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}