import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import accountScreens from "./translations/accountScreens";
import otherComponents from "./translations/otherComponents";

const LANGUAGE_STORAGE_KEY = "i18nextLng";

const translations = {
  ...accountScreens,
  ...otherComponents,
  "Admin Panel": "एडमिन पैनल",
  "AI Chatbot": "एआई चैटबॉट",
  "Admin Dashboard": "एडमिन डैशबोर्ड",
  "Manage your chatbot platform": "अपने चैटबॉट प्लेटफ़ॉर्म को प्रबंधित करें",
  "Client Panel": "क्लाइंट पैनल",
  "Main Menu": "मुख्य मेनू",
  Dashboard: "डैशबोर्ड",
  Clients: "क्लाइंट",
  "Subscription Plans": "सब्सक्रिप्शन प्लान",
  Subscriptions: "सब्सक्रिप्शन",
  Transactions: "लेन-देन",
  Analytics: "विश्लेषण",
  "Support Ticket": "सपोर्ट टिकट",
  Settings: "सेटिंग्स",
  Products: "प्रोडक्ट",
  FAQs: "अक्सर पूछे जाने वाले प्रश्न",
  Tickets: "टिकट",
  "Conversations History": "बातचीत का इतिहास",
  "Chatbot Settings": "चैटबॉट सेटिंग्स",
  Subscription: "सब्सक्रिप्शन",
  "Email Support": "ईमेल सहायता",
  "Welcome back, {name}": "वापसी पर स्वागत है, {name}",
  "Manage your AI chatbot from here.": "यहाँ से अपने एआई चैटबॉट को प्रबंधित करें।",
  "Switch to light mode": "लाइट मोड पर जाएँ",
  "Switch to dark mode": "डार्क मोड पर जाएँ",
  "Toggle theme": "थीम बदलें",
  "Search...": "खोजें...",
  Search: "खोजें",
  Profile: "प्रोफ़ाइल",
  Logout: "लॉग आउट",
  "Logout Confirmation": "लॉग आउट की पुष्टि",
  "Are you sure you want to logout? You will need to login again to access your account.":
    "क्या आप लॉग आउट करना चाहते हैं? खाते तक पहुँचने के लिए आपको फिर से लॉग इन करना होगा।",
  "Logging out...": "लॉग आउट हो रहा है...",
  Cancel: "रद्द करें",
  "New Chat": "नई बातचीत",
  Library: "लाइब्रेरी",
  Projects: "प्रोजेक्ट",
  "Recent Chats": "हाल की बातचीत",
  "New Conversation": "नई बातचीत",
  Pin: "पिन करें",
  More: "और विकल्प",
  Share: "शेयर करें",
  Delete: "हटाएँ",
  "No conversations": "कोई बातचीत नहीं",
  "Start a new chat to see your conversations here.":
    "बातचीत यहाँ देखने के लिए नई चैट शुरू करें।",
  "Delete Conversation?": "बातचीत हटाएँ?",
  "Are you sure you want to delete this conversation? This action cannot be undone.":
    "क्या आप यह बातचीत हटाना चाहते हैं? इसे वापस नहीं किया जा सकता।",
  "Deleting...": "हटाया जा रहा है...",
  "Loading conversation...": "बातचीत लोड हो रही है...",
  "Loading chatbot...": "चैटबॉट लोड हो रहा है...",
  "Your trusted business assistant": "आपका भरोसेमंद बिज़नेस सहायक",
  "New chat": "नई चैट",
  Login: "लॉग इन",
  "Toggle language": "भाषा बदलें",
  "Profile settings": "प्रोफ़ाइल सेटिंग्स",
  English: "अंग्रेज़ी",
  Hindi: "हिन्दी",
  "AI Assistant": "एआई सहायक",
  "Client Dashboard": "क्लाइंट डैशबोर्ड",
  "Manage your AI chatbot platform configuration and preferences.":
    "अपने एआई चैटबॉट प्लेटफ़ॉर्म की सेटिंग्स और प्राथमिकताएँ प्रबंधित करें।",
  "Admin Settings": "एडमिन सेटिंग्स",
  General: "सामान्य",
  "AI Configuration": "एआई कॉन्फ़िगरेशन",
  "Usage & Limits": "उपयोग और सीमाएँ",
  Notifications: "सूचनाएँ",
  Security: "सुरक्षा",
  Preferences: "प्राथमिकताएँ",
  "General Settings": "सामान्य सेटिंग्स",
  "Platform Name": "प्लेटफ़ॉर्म का नाम",
  "Support Email": "सपोर्ट ईमेल",
  "Default Language": "डिफ़ॉल्ट भाषा",
  "Platform Status": "प्लेटफ़ॉर्म स्थिति",
  "Maintenance Mode": "मेंटेनेंस मोड",
  "AI Configuration Note": "एआई कॉन्फ़िगरेशन नोट",
  "Default AI Model": "डिफ़ॉल्ट एआई मॉडल",
  "Chat History": "चैट इतिहास",
  "Streaming Responses": "स्ट्रीमिंग जवाब",
  "Fallback Responses": "वैकल्पिक जवाब",
  "Plan-based Limits": "प्लान-आधारित सीमाएँ",
  "Monthly Usage Alerts": "मासिक उपयोग अलर्ट",
  "Notification Preferences": "सूचना प्राथमिकताएँ",
  "Email Notifications": "ईमेल सूचनाएँ",
  "New Client Registration": "नया क्लाइंट पंजीकरण",
  "Subscription Events": "सब्सक्रिप्शन गतिविधियाँ",
  "Payment Notifications": "भुगतान सूचनाएँ",
  "Security Settings": "सुरक्षा सेटिंग्स",
  "Maximum Login Attempts": "अधिकतम लॉगिन प्रयास",
  "Two-Factor Authentication": "दो-चरणीय प्रमाणीकरण",
  "Save Changes": "बदलाव सेव करें",
  "Save Settings": "सेटिंग्स सेव करें",
  "Saving...": "सेव हो रहा है...",
  "Settings updated successfully.": "सेटिंग्स सफलतापूर्वक अपडेट हुईं।",
  "Failed to load settings": "सेटिंग्स लोड नहीं हो सकीं",
  Retry: "फिर प्रयास करें",
  Clear: "साफ़ करें",
  Refresh: "रीफ़्रेश",
  "Export page": "पेज एक्सपोर्ट करें",
  "Total transactions": "कुल लेन-देन",
  "Successful transactions": "सफल लेन-देन",
  Succeeded: "सफल",
  Failed: "विफल",
  Refunded: "रिफंड किया गया",
  "No transactions found": "कोई लेन-देन नहीं मिला",
  "Could not load Stripe transactions": "Stripe लेन-देन लोड नहीं हो सके",
  "Forgot password?": "पासवर्ड भूल गए?",
  "Create account": "खाता बनाएँ",
  "Don't have an account?": "खाता नहीं है?",
  "Already have an account?": "पहले से खाता है?",
  "Sign in": "साइन इन",
  "Sign up": "साइन अप",
  Email: "ईमेल",
  Password: "पासवर्ड",
  "Full Name": "पूरा नाम",
  Submit: "सबमिट करें",
  "Send Message": "संदेश भेजें",
  "Type your message...": "अपना संदेश लिखें...",
  "How can I help you today?": "आज मैं आपकी कैसे मदद कर सकता हूँ?",
  "Smart Conversations": "स्मार्ट बातचीत",
  "Account created successfully.": "खाता सफलतापूर्वक बनाया गया।",
  "Failed to create account.": "खाता नहीं बनाया जा सका।",
  "An error occurred while logging in.": "लॉग इन करते समय त्रुटि हुई।",
  "Login successful": "लॉग इन सफल रहा",
  "Review Stripe payments, failures, refunds, and receipts.":
    "Stripe भुगतान, विफलताएँ, रिफंड और रसीदें देखें।",
  Client: "क्लाइंट",
  Plan: "प्लान",
  Status: "स्थिति",
  Chatbot: "चैटबॉट",
  "Can I help you with anything today?": "क्या मैं आज आपकी किसी काम में मदद कर सकता हूँ?",
  "Ask anything about {business}": "{business} के बारे में कुछ भी पूछें",
  "Ask {business} anything...": "{business} से कुछ भी पूछें...",
  "Message AI Chat...": "एआई चैट में संदेश लिखें...",
  "Loading questions...": "सवाल लोड हो रहे हैं...",
  "You can ask": "आप पूछ सकते हैं",
  "AI Platform": "एआई प्लेटफ़ॉर्म",
  "Hi 👋 Welcome to {business}! How can I help you today?":
    "नमस्ते 👋 {business} में आपका स्वागत है! आज मैं आपकी कैसे मदद कर सकता हूँ?",
  "Manage your business information, contact details, chatbot configuration and AI instructions.":
    "अपने व्यवसाय की जानकारी, संपर्क विवरण, चैटबॉट कॉन्फ़िगरेशन और एआई निर्देश प्रबंधित करें।",
  "Business Information": "व्यवसाय की जानकारी",
  "Basic information about your business.": "आपके व्यवसाय की बुनियादी जानकारी।",
  "Business Name": "व्यवसाय का नाम",
  "Business Type": "व्यवसाय का प्रकार",
  "Business Description": "व्यवसाय का विवरण",
  "Tell customers about your business...": "ग्राहकों को अपने व्यवसाय के बारे में बताएँ...",
  "Business Address": "व्यवसाय का पता",
  "Add the physical location of your business.": "अपने व्यवसाय का भौतिक पता जोड़ें।",
  "Contact Information": "संपर्क जानकारी",
  "Contact details that your chatbot can provide to customers.":
    "वह संपर्क जानकारी जो आपका चैटबॉट ग्राहकों को दे सकता है।",
  "Chatbot Configuration": "चैटबॉट कॉन्फ़िगरेशन",
  "Configure how your AI chatbot appears and communicates with customers.":
    "तय करें कि आपका एआई चैटबॉट ग्राहकों को कैसा दिखे और उनसे कैसे बात करे।",
  "Select language": "भाषा चुनें",
  "Select tone": "टोन चुनें",
  "Select status": "स्थिति चुनें",
  "Hi 👋 Welcome! How can I help you today?":
    "नमस्ते 👋 स्वागत है! आज मैं आपकी कैसे मदद कर सकता हूँ?",
  "Tell the AI how it should help customers...":
    "एआई को बताएँ कि उसे ग्राहकों की मदद कैसे करनी चाहिए...",
  "Predefined Questions": "पहले से तय सवाल",
  "Questions customers can quickly ask your chatbot.":
    "वे सवाल जो ग्राहक आपके चैटबॉट से जल्दी पूछ सकते हैं।",
  "Drag to reorder": "क्रम बदलने के लिए खींचें",
  "Enter customer question...": "ग्राहक का सवाल दर्ज करें...",
  "Delete question": "सवाल हटाएँ",
  "Save your changes": "अपने बदलाव सेव करें",
  "Search web": "वेब पर खोजें",
  OR: "या",
  "Create password": "पासवर्ड बनाएँ",
  "Confirm password": "पासवर्ड की पुष्टि करें",
  "Transaction details": "लेन-देन का विवरण",
  Amount: "राशि",
  "Unknown customer": "अज्ञात ग्राहक",
  "Payment method": "भुगतान का तरीका",
  "Invoice ID": "इनवॉइस आईडी",
  "Payment intent": "भुगतान इंटेंट",
  "Refunded amount": "रिफंड की गई राशि",
  "Customer ID": "ग्राहक आईडी",
  "Open Stripe receipt": "Stripe रसीद खोलें",
  "Close transaction details": "लेन-देन का विवरण बंद करें",
  "From date": "शुरुआती तारीख",
  "To date": "अंतिम तारीख",
  "Could not load all-time transaction totals.": "सभी लेन-देन के कुल आँकड़े लोड नहीं हो सके।",
  "Please try again.": "कृपया फिर से प्रयास करें।",
  "Loading transactions...": "लेन-देन लोड हो रहे हैं...",
  Transaction: "लेन-देन",
  Customer: "ग्राहक",
  Date: "तारीख",
  Details: "विवरण",
  "Stripe payment": "Stripe भुगतान",
  "Transaction ID": "लेन-देन आईडी",
  Currency: "मुद्रा",
  "Payment intent ID": "पेमेंट इंटेंट आईडी",
  "No email": "ईमेल उपलब्ध नहीं",
  Unknown: "अज्ञात",
  "Contact Support": "सहायता टीम से संपर्क करें",
  "Need Help?": "मदद चाहिए?",
  Pending: "लंबित",
  Chat: "चैट",
  "Check out this conversation": "यह बातचीत देखें",
  "Check out this chat": "यह चैट देखें",
  "Conversation link copied!": "बातचीत का लिंक कॉपी हो गया!",
  "Chat link copied!": "चैट का लिंक कॉपी हो गया!",
  "Conversation deleted successfully": "बातचीत सफलतापूर्वक हटाई गई",
  "Logout failed": "लॉग आउट विफल रहा",
  "You can upload a maximum of 5 files.": "आप अधिकतम 5 फ़ाइलें अपलोड कर सकते हैं।",
  "Thank you for message response": "आपकी प्रतिक्रिया के लिए धन्यवाद",
  "Copied to clipboard": "क्लिपबोर्ड पर कॉपी किया गया",
  "Unable to copy link.": "लिंक कॉपी नहीं हो सका।",
  "Collapse Sidebar": "साइडबार छोटा करें",
  "Open menu": "मेनू खोलें",
  Administrator: "प्रशासक",
  Admin: "एडमिन",
  "Admin account": "एडमिन खाता",
  User: "उपयोगकर्ता",
  "No email available": "ईमेल उपलब्ध नहीं",
  Free: "निःशुल्क",
  "Address Line 1": "पता पंक्ति 1",
  "Address Line 2": "पता पंक्ति 2",
  "12 Main Market": "12 मुख्य बाज़ार",
  "Near City Mall": "सिटी मॉल के पास",
  "Book Store": "किताबों की दुकान",
  Neemuch: "नीमच",
  "Madhya Pradesh": "मध्य प्रदेश",
  India: "भारत",
  City: "शहर",
  State: "राज्य",
  Country: "देश",
  "Postal Code": "डाक कोड",
  "Google Maps URL": "Google Maps URL",
  Phone: "फ़ोन",
  "Alternate Phone": "वैकल्पिक फ़ोन",
  WhatsApp: "WhatsApp",
  Website: "वेबसाइट",
  "Business Status": "व्यवसाय की स्थिति",
  "Welcome Message": "स्वागत संदेश",
  "AI Instructions": "एआई निर्देश",
  "Chatbots Online": "ऑनलाइन चैटबॉट",
  "Subscriptions Active": "सक्रिय सब्सक्रिप्शन",
  "Something went wrong": "कुछ गलत हो गया",
  "An unexpected error occurred. Please reload the page and try again.":
    "एक अप्रत्याशित त्रुटि हुई। कृपया पेज रीलोड करके फिर प्रयास करें।",
  "Reload Page": "पेज रीलोड करें",
  "Loading...": "लोड हो रहा है...",
  Friendly: "मिलनसार",
  friendly: "मिलनसार",
  professional: "पेशेवर",
  casual: "अनौपचारिक",
  english: "अंग्रेज़ी",
  hindi: "हिन्दी",
  hinglish: "हिंग्लिश",
  "Bot Name": "बॉट का नाम",
  Language: "भाषा",
  Tone: "टोन",
  Back: "वापस",
  Privacy: "गोपनीयता",
  Policy: "नीति",
  Terms: "नियम",
  Conditions: "शर्तें",
  "Contact Us": "संपर्क करें",
  "Your Privacy Matters": "आपकी गोपनीयता महत्वपूर्ण है",
  "We are committed to maintaining the confidentiality and security of your personal information. Our policies are regularly updated to ensure transparency and compliance with privacy standards.":
    "हम आपकी व्यक्तिगत जानकारी की गोपनीयता और सुरक्षा बनाए रखने के लिए प्रतिबद्ध हैं। पारदर्शिता और गोपनीयता मानकों का पालन सुनिश्चित करने के लिए हमारी नीतियाँ नियमित रूप से अपडेट की जाती हैं।",
  "Information We Collect": "हम कौन सी जानकारी एकत्र करते हैं",
  "We may collect information such as your name, email address, profile details, device information, browser details, and usage analytics to improve our services.":
    "हम अपनी सेवाओं को बेहतर बनाने के लिए आपका नाम, ईमेल पता, प्रोफ़ाइल विवरण, डिवाइस और ब्राउज़र की जानकारी तथा उपयोग विश्लेषण एकत्र कर सकते हैं।",
  "How We Use Your Information": "हम आपकी जानकारी का उपयोग कैसे करते हैं",
  "Your information helps us provide personalized experiences, improve platform performance, process requests, enhance security, and communicate important updates.":
    "आपकी जानकारी हमें व्यक्तिगत अनुभव देने, प्लेटफ़ॉर्म का प्रदर्शन बेहतर करने, अनुरोधों को संसाधित करने, सुरक्षा बढ़ाने और महत्वपूर्ण अपडेट साझा करने में मदद करती है।",
  "Data Protection": "डेटा सुरक्षा",
  "We use industry-standard security measures including encryption, authentication, and secure storage practices to protect your personal information.":
    "हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए एन्क्रिप्शन, प्रमाणीकरण और सुरक्षित संग्रहण जैसी मानक सुरक्षा प्रक्रियाओं का उपयोग करते हैं।",
  "Third-Party Services": "तृतीय-पक्ष सेवाएँ",
  "Some services such as payment gateways, analytics, or cloud providers may process limited information necessary for providing their services.":
    "भुगतान गेटवे, विश्लेषण या क्लाउड प्रदाता जैसी कुछ सेवाएँ अपनी सेवाएँ देने के लिए आवश्यक सीमित जानकारी संसाधित कर सकती हैं।",
  "Your Rights": "आपके अधिकार",
  "You may request access, correction, deletion, or export of your personal data at any time according to applicable privacy regulations.":
    "लागू गोपनीयता नियमों के अनुसार आप कभी भी अपने व्यक्तिगत डेटा को देखने, सुधारने, हटाने या निर्यात करने का अनुरोध कर सकते हैं।",
  "If you have any questions regarding this Privacy Policy, feel free to contact our support team.":
    "इस गोपनीयता नीति के बारे में कोई सवाल हो तो हमारी सहायता टीम से संपर्क करें।",
  "Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information while using our platform.":
    "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह नीति बताती है कि हमारे प्लेटफ़ॉर्म का उपयोग करते समय हम आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग, संग्रहित और सुरक्षित करते हैं।",
  "Last Updated": "आखिरी बार अपडेट किया गया",
  "Acceptance of Terms": "शर्तों की स्वीकृति",
  "By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue using the service immediately.":
    "हमारे प्लेटफ़ॉर्म तक पहुँचकर या उसका उपयोग करके आप इन नियमों और शर्तों से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो सेवा का उपयोग तुरंत बंद करें।",
  "User Responsibilities": "उपयोगकर्ता की ज़िम्मेदारियाँ",
  "Users are responsible for maintaining the confidentiality of their account credentials and all activities performed under their account.":
    "उपयोगकर्ता अपने खाते के लॉगिन विवरण गोपनीय रखने और खाते के अंतर्गत की गई सभी गतिविधियों के लिए ज़िम्मेदार हैं।",
  "Privacy & Security": "गोपनीयता और सुरक्षा",
  "We are committed to protecting your information. Personal data is processed according to our Privacy Policy.":
    "हम आपकी जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं। व्यक्तिगत डेटा हमारी गोपनीयता नीति के अनुसार संसाधित किया जाता है।",
  "Prohibited Activities": "निषिद्ध गतिविधियाँ",
  "You may not misuse the platform, attempt unauthorized access, distribute malicious software, or violate applicable laws.":
    "आप प्लेटफ़ॉर्म का दुरुपयोग, अनधिकृत पहुँच का प्रयास, दुर्भावनापूर्ण सॉफ़्टवेयर का वितरण या लागू कानूनों का उल्लंघन नहीं कर सकते।",
  "Changes to Terms": "शर्तों में बदलाव",
  "We reserve the right to update these Terms at any time. Continued use of the platform constitutes acceptance of the revised Terms.":
    "हम किसी भी समय इन शर्तों को अपडेट करने का अधिकार रखते हैं। प्लेटफ़ॉर्म का उपयोग जारी रखने का अर्थ संशोधित शर्तों को स्वीकार करना है।",
  "If you have any questions regarding these Terms & Conditions, please contact our support team.":
    "इन नियमों और शर्तों के बारे में कोई सवाल हो तो हमारी सहायता टीम से संपर्क करें।",
  "Please read these Terms & Conditions carefully before using our platform.":
    "हमारे प्लेटफ़ॉर्म का उपयोग करने से पहले इन नियमों और शर्तों को ध्यान से पढ़ें।",
  "If you have any questions about our Terms & Conditions, please contact our support team.":
    "हमारे नियमों और शर्तों के बारे में कोई सवाल हो तो हमारी सहायता टीम से संपर्क करें।",
  "All-time Stripe charges": "Stripe के अब तक के कुल भुगतान",
  "All-time successful payments": "अब तक के सफल भुगतान",
  "Failed payments on this page": "इस पेज पर विफल भुगतान",
  "Full or partial refunds on this page": "इस पेज पर पूरे या आंशिक रिफंड",
  "Search customer, email, charge ID...": "ग्राहक, ईमेल या चार्ज आईडी खोजें...",
  "All statuses": "सभी स्थितियाँ",
  "Partially refunded": "आंशिक रिफंड",
  "Date from": "शुरुआती तारीख",
  "Date to": "अंतिम तारीख",
  "Try changing the status, date range, or search terms.":
    "स्थिति, तारीख की सीमा या खोज शब्द बदलकर देखें।",
  "Transactions on this page": "इस पेज के लेन-देन",
  "Filtered Stripe charges": "फ़िल्टर किए गए Stripe भुगतान",
  "Successful payments on this page": "इस पेज के सफल भुगतान",
  "Support Center": "सहायता केंद्र",
  "We're here to help": "हम आपकी मदद के लिए हैं",
  "Describe your question or issue and send it to our support team.":
    "अपना सवाल या समस्या लिखें और सहायता टीम को भेजें।",
  "Secure communication": "सुरक्षित संचार",
  "Your request will be submitted to the support ticket system.":
    "आपका अनुरोध सपोर्ट टिकट सिस्टम में भेजा जाएगा।",
  "Create Support Ticket": "सपोर्ट टिकट बनाएँ",
  "Fill in the details below and our team will assist you.":
    "नीचे विवरण भरें, हमारी टीम आपकी सहायता करेगी।",
  "Current Plan": "वर्तमान प्लान",
  "Ticket priority is determined by your plan.":
    "टिकट की प्राथमिकता आपके प्लान के आधार पर तय होती है।",
  "Enter the email address associated with your support request.":
    "अपने सहायता अनुरोध से जुड़ा ईमेल पता दर्ज करें।",
  Subject: "विषय",
  Description: "विवरण",
  "Submit Ticket": "टिकट सबमिट करें",
  "Submitting...": "सबमिट हो रहा है...",
  "Clear Form": "फ़ॉर्म साफ़ करें",
  "Use strong passwords, secure HTTP-only cookies, server-side session validation and rate limiting for admin APIs.":
    "मज़बूत पासवर्ड, सुरक्षित HTTP-only कुकी, सर्वर-साइड सेशन सत्यापन और एडमिन API पर रेट लिमिटिंग का उपयोग करें।",
  "Configure your platform's basic information.":
    "अपने प्लेटफ़ॉर्म की बुनियादी जानकारी सेट करें।",
  "Control the availability of your SaaS platform.":
    "अपने SaaS प्लेटफ़ॉर्म की उपलब्धता नियंत्रित करें।",
  "Set default AI behavior for newly created client chatbots.":
    "नए क्लाइंट चैटबॉट के लिए डिफ़ॉल्ट एआई व्यवहार तय करें।",
  "Configure when clients receive monthly usage alerts.":
    "तय करें कि क्लाइंट को मासिक उपयोग अलर्ट कब मिलें।",
  "Choose which platform events should trigger admin notifications.":
    "चुनें कि किन प्लेटफ़ॉर्म गतिविधियों पर एडमिन को सूचना मिले।",
  "Manage platform access and session security.":
    "प्लेटफ़ॉर्म की पहुँच और सेशन सुरक्षा प्रबंधित करें।",
  "Temporarily restrict client access while maintenance is in progress.":
    "मेंटेनेंस के दौरान क्लाइंट की पहुँच अस्थायी रूप से रोकें।",
  "Enable email notifications for important platform events.":
    "महत्वपूर्ण प्लेटफ़ॉर्म गतिविधियों के लिए ईमेल सूचनाएँ चालू करें।",
  "Get notified whenever a new client is created.":
    "नया क्लाइंट बनने पर सूचना पाएँ।",
  "Receive notifications for subscription creation, upgrade, downgrade and cancellation.":
    "सब्सक्रिप्शन बनने, अपग्रेड, डाउनग्रेड और रद्द होने पर सूचना पाएँ।",
  "Receive notifications for successful and failed payments.":
    "सफल और विफल भुगतानों के लिए सूचना पाएँ।",
  "Require an additional verification step for admin login.":
    "एडमिन लॉगिन के लिए अतिरिक्त सत्यापन आवश्यक करें।",
  "Make sure to save your changes before leaving this page.":
    "इस पेज से जाने से पहले बदलाव सेव करना न भूलें।",
  "Ticket Created Successfully": "टिकट सफलतापूर्वक बनाया गया",
  "Unable to Create Ticket": "टिकट नहीं बनाया जा सका",
  "Contact your support team directly": "अपनी सहायता टीम से सीधे संपर्क करें",
  "Keep your subject short and clear.": "विषय छोटा और स्पष्ट रखें।",
  "Include relevant details so the team can help you.":
    "टीम की सहायता के लिए ज़रूरी विवरण शामिल करें।",
  "Reset Form": "फ़ॉर्म रीसेट करें",
  "Creating Ticket...": "टिकट बनाया जा रहा है...",
  "Please verify your email address and message before submitting.":
    "सबमिट करने से पहले ईमेल पता और संदेश जाँच लें।",
  "e.g. Chatbot is not responding": "उदाहरण: चैटबॉट जवाब नहीं दे रहा है",
  "Describe your question or issue in detail...": "अपना सवाल या समस्या विस्तार से बताएँ...",
  "Message / Description": "संदेश / विवरण",
  "Support ticket created. Email notifications are queued for delivery.":
    "सपोर्ट टिकट बन गया है। ईमेल सूचनाएँ भेजने के लिए कतार में हैं।",
  "Support ticket created, but an email notification could not be queued.":
    "सपोर्ट टिकट बन गया है, लेकिन ईमेल सूचना कतार में नहीं जोड़ी जा सकी।",
  "Enter platform name": "प्लेटफ़ॉर्म का नाम दर्ज करें",
  "Enter a Gemini model": "Gemini मॉडल चुनें",
  "Temperature (0-2)": "टेम्परेचर (0-2)",
  "Max Output Tokens (1-8192)": "अधिकतम आउटपुट टोकन (1-8192)",
  "Allow chatbots to use previous conversation context.":
    "चैटबॉट को पिछली बातचीत का संदर्भ उपयोग करने दें।",
  "Display AI responses as they are generated.": "बनते ही एआई जवाब दिखाएँ।",
  "Enable a fallback response when AI generation fails.":
    "एआई जवाब न बना पाए तो वैकल्पिक जवाब चालू रखें।",
  "These values should act as platform defaults. Client-specific chatbot settings and subscription plan limits should take priority wherever configured.":
    "ये मान प्लेटफ़ॉर्म के डिफ़ॉल्ट होंगे। जहाँ क्लाइंट की चैटबॉट सेटिंग या सब्सक्रिप्शन सीमा मौजूद हो, उसे प्राथमिकता मिलेगी।",
  "Client Usage Alert Threshold (%)": "क्लाइंट उपयोग अलर्ट सीमा (%)",
  "When on, notify clients as monthly responses, token budget, or conversations reach this threshold. When off, no usage alerts are sent.":
    "चालू होने पर मासिक जवाब, टोकन बजट या बातचीत इस सीमा तक पहुँचने पर क्लाइंट को सूचना मिलेगी। बंद होने पर उपयोग अलर्ट नहीं भेजे जाएँगे।",
  "Client message limits, token limits, FAQ limits and chatbot configuration restrictions should be controlled through Subscription Plans, not by overriding individual client settings here.":
    "क्लाइंट संदेश, टोकन, FAQ और चैटबॉट कॉन्फ़िगरेशन सीमाएँ यहाँ अलग से बदलने के बजाय सब्सक्रिप्शन प्लान से नियंत्रित करें।",
  "Manage your platform, AI models, client usage and security from one place.":
    "प्लेटफ़ॉर्म, एआई मॉडल, क्लाइंट उपयोग और सुरक्षा को एक जगह से प्रबंधित करें।",
  "Sign in to continue": "जारी रखने के लिए लॉग इन करें",
  "Welcome Back 👋": "वापसी पर स्वागत है 👋",
  "Verify your login": "लॉगिन सत्यापित करें",
  "Enter the 6-digit code sent to your admin email":
    "एडमिन ईमेल पर भेजा गया 6 अंकों का कोड दर्ज करें",
  "Enter your email": "अपना ईमेल दर्ज करें",
  "Enter your password": "अपना पासवर्ड दर्ज करें",
  "Remember me": "मुझे याद रखें",
  "Forgot Password?": "पासवर्ड भूल गए?",
  "Continue with Google": "Google के साथ जारी रखें",
  "Create Account 🚀": "खाता बनाएँ 🚀",
  "Fill your details to get started.": "शुरू करने के लिए अपना विवरण भरें।",
  "Join AI Assistant": "AI Assistant से जुड़ें",
  "Create your account and unlock powerful AI tools, conversations, image generation and much more.":
    "अपना खाता बनाएँ और शक्तिशाली एआई टूल, बातचीत, इमेज जनरेशन और बहुत कुछ पाएँ।",
  "Monitor clients and chatbot activity.": "क्लाइंट और चैटबॉट गतिविधि पर नज़र रखें।",
  "View All Clients": "सभी क्लाइंट देखें",
  "Total Clients": "कुल क्लाइंट",
  "Registered clients": "पंजीकृत क्लाइंट",
  "Active Clients": "सक्रिय क्लाइंट",
  "Currently active": "अभी सक्रिय",
  "Inactive Clients": "निष्क्रिय क्लाइंट",
  "Currently inactive": "अभी निष्क्रिय",
  "New Clients": "नए क्लाइंट",
  "Added this month": "इस महीने जोड़े गए",
  "Client Activity": "क्लाइंट गतिविधि",
  "Client activity overview": "क्लाइंट गतिविधि का सारांश",
  "Refresh activity": "गतिविधि रीफ़्रेश करें",
  "Last Login": "अंतिम लॉगिन",
  Action: "कार्यवाही",
  View: "देखें",
  "Manage your client, products, FAQs and chatbot configuration.":
    "अपने क्लाइंट, प्रोडक्ट, FAQ और चैटबॉट सेटिंग्स प्रबंधित करें।",
  "Not configured": "कॉन्फ़िगर नहीं किया गया",
  Manage: "प्रबंधित करें",
  "Product catalogue": "प्रोडक्ट सूची",
  "Frequently asked questions": "अक्सर पूछे जाने वाले प्रश्न",
  "Usage Analytics": "उपयोग विश्लेषण",
  "Track your Gemini API usage and plan limits.":
    "Gemini API उपयोग और प्लान सीमाएँ देखें।",
  "Gemini Tokens": "Gemini टोकन",
  "Total token consumption": "कुल टोकन उपयोग",
  Conversations: "बातचीत",
  "Conversations created": "बनाई गई बातचीत",
  "AI Responses": "एआई जवाब",
  "Responses generated": "बनाए गए जवाब",
  "Quick Actions": "त्वरित कार्य",
  "Manage your chatbot data quickly.": "अपने चैटबॉट डेटा को जल्दी प्रबंधित करें।",
  "Manage Products": "प्रोडक्ट प्रबंधित करें",
  "Add or update products": "प्रोडक्ट जोड़ें या अपडेट करें",
  "Manage FAQs": "FAQ प्रबंधित करें",
  "Add or update FAQs": "FAQ जोड़ें या अपडेट करें",
  "Manage Tickets": "टिकट प्रबंधित करें",
  "Resolve your tickets": "अपने टिकट हल करें",
  "Configure your AI chatbot": "अपने एआई चैटबॉट को कॉन्फ़िगर करें",
  "Client Settings": "क्लाइंट सेटिंग्स",
  "Update business information": "व्यवसाय की जानकारी अपडेट करें",
  "Current chatbot configuration for your client.":
    "आपके क्लाइंट के लिए वर्तमान चैटबॉट कॉन्फ़िगरेशन।",
  Edit: "संपादित करें",
  "Enter your full name": "अपना पूरा नाम दर्ज करें",
  "Email Address": "ईमेल पता",
  "Confirm Password": "पासवर्ड की पुष्टि करें",
  "Creating Account...": "खाता बनाया जा रहा है...",
  "Create Account": "खाता बनाएँ",
  "Good Morning": "सुप्रभात",
  "Good Afternoon": "नमस्कार",
  "Good Evening": "शुभ संध्या",
  "Good Night": "शुभ रात्रि",
  "Ask anything...": "कुछ भी पूछें...",
  "AI can make mistakes. Verify important information.":
    "एआई से गलती हो सकती है। महत्वपूर्ण जानकारी की पुष्टि करें।",
  "Thinking": "सोच रहा है",
  Good: "अच्छा",
  Bad: "खराब",
  "Verification code": "सत्यापन कोड",
  "Enter 6-digit code": "6 अंकों का कोड दर्ज करें",
  "Verifying...": "सत्यापन हो रहा है...",
  "Logging in...": "लॉग इन हो रहा है...",
  "Verify and sign in": "सत्यापित करें और लॉग इन करें",
  "Back to sign in": "लॉग इन पर वापस जाएँ",
  "Experience next-generation AI conversations with a clean, fast and intelligent assistant.":
    "तेज़ और बुद्धिमान सहायक के साथ नई पीढ़ी की एआई बातचीत का अनुभव करें।",
};

const LanguageContext = createContext(null);

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage === "hi" || savedLanguage === "en") {
    return savedLanguage;
  }

  return window.navigator.language?.toLowerCase().startsWith("hi") ? "hi" : "en";
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage) => {
    if (nextLanguage !== "en" && nextLanguage !== "hi") {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const t = useCallback(
    (key, values = {}) => {
      const translated = language === "hi" ? translations[key] || key : key;
      return Object.entries(values).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, value),
        translated,
      );
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
