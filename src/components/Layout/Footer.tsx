import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Heart, Info, Phone, FileText, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // لإضافة زر الإغلاق

interface FooterProps {
  language: 'en' | 'ar';
}

export function Footer({ language }: FooterProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showAboutImage, setShowAboutImage] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalContent, setModalContent] = useState({ title: '', body: '' });

  const openModal = (title, body) => {
  setModalContent({ title, body });
  setIsModalOpen(true);
};
  
const menuItems = [
  {
    icon: <Info className="w-4 h-4" />,
    label: language === 'en' ? 'About Us' : 'من نحن',
    action: () => openModal(language === 'en' ? 'About Us' : 'من نحن', 
      language === 'en' ? 'We are a team dedicated to providing quality services.' : 'نحن فريق ملتزم بتقديم خدمات عالية الجودة.')
  },
  {
    icon: <Phone className="w-4 h-4" />,
    label: language === 'en' ? 'Contact' : 'اتصل بنا',
    action: () => openModal(language === 'en' ? 'Contact Us' : 'اتصل بنا', 
      language === 'en' 
        ? 'Call us: +967771606422\nWhatsApp only: +967735208453' 
        : 'اتصال وواتس اب: +967771606422\nواتس اب فقط: +967735208453')
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية',
    action: () => openModal(language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية', 
      language === 'en' 
              ? 'We respect your privacy and strive to protect your personal data. Information is collected only when necessary to improve your experience. We are committed to not sharing your personal information with third parties without your consent and take all security measures to protect it. For any privacy-related inquiries, please contact us.'
                : 'نحترم خصوصيتك ونسعى لحماية بياناتك الشخصية. يتم جمع المعلومات فقط عند الضرورة لتحسين تجربتك معنا. نلتزم بعدم مشاركة بياناتك الشخصية مع أطراف ثالثة دون موافقتك ونتخذ جميع التدابير الأمنية لحمايتها. لأي استفسارات تتعلق بالخصوصية، يرجى الاتصال بنا.'
                           )
  },
];
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-t mt-auto relative shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-2"
  >
    <span className="text-gray-600 font-medium">
      © 2024 {language === 'en' ? 'Developed by' : 'تطوير'}{' '}
      <span className="text-purple-600">Khalid Ahmed</span>
    </span>
  </motion.div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-600 font-medium">
                {language === 'en' ? 'More' : 'المزيد'}
              </span>
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 overflow-hidden"
                >
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={index}
                      onClick={item.action}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      {item.icon}
                      <span className="text-gray-700 font-medium">{item.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* سياسة الخصوصية */}
        {showPrivacyPolicy && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-lg font-bold">{language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}</h3>
            <p className="mt-2 text-sm">
              {language === 'en'
                ? 'We respect your privacy and strive to protect your personal data. Information is collected only when necessary to improve your experience. We are committed to not sharing your personal information with third parties without your consent and take all security measures to protect it. For any privacy-related inquiries, please contact us.'
                : 'نحترم خصوصيتك ونسعى لحماية بياناتك الشخصية. يتم جمع المعلومات فقط عند الضرورة لتحسين تجربتك معنا. نلتزم بعدم مشاركة بياناتك الشخصية مع أطراف ثالثة دون موافقتك ونتخذ جميع التدابير الأمنية لحمايتها. لأي استفسارات تتعلق بالخصوصية، يرجى الاتصال بنا.'}
            </p>
          </div>
        )}

        {/* من نحن - عرض صورة محلية */}
        {showAboutImage && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow-md">
            <img src="/path/to/your-local-image.jpg" alt={language === 'en' ? 'About Us' : 'عنّا'} className="w-full h-auto rounded" />
          </div>
        )}
      </div>

          {/* نافذة منبثقة */}
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
        >
          <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2">
              <X className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </button>
            <h2 className="text-xl font-bold mb-4">{modalContent.title}</h2>
            <p className="text-gray-700 whitespace-pre-line">{modalContent.body}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </motion.footer>
  );
}
