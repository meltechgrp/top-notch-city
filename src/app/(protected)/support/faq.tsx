import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { Box, Text, View } from "@/components/ui";

const faqs = [
  {
    question: "What services does Top-Notch City Estates offer?",
    answer:
      "We specialize in buying, selling, and renting properties across Nigeria and beyond. Our platform also features property listings, virtual tours, and map-based search functionality.",
  },
  {
    question: "How do I list my property?",
    answer:
      "You can list your property by signing up and creating a seller or agent profile. Once verified, you can upload property details, images, and pricing directly from your dashboard.",
  },
  {
    question: "Is there a fee to list my property?",
    answer:
      "Basic listings are free. However, we offer premium listing options that give your property more visibility for a small fee.",
  },
  {
    question: "How do I schedule a property viewing?",
    answer:
      'You can schedule a viewing by clicking the "Book a Viewing" button on any property page. A Top-Notch City Estates agent will contact you to confirm your appointment.',
  },
  {
    question: "Are the properties verified?",
    answer:
      "Yes, all listed properties go through a verification process to ensure legitimacy and accuracy. Verified listings will carry a “Verified” badge.",
  },
  {
    question: "Can I get a mortgage or financing through your platform?",
    answer:
      "Yes, we partner with select financial institutions to provide property financing. Contact our support team to guide you through the mortgage application process.",
  },
  {
    question: "Do you have an app?",
    answer:
      "Yes! You can download the Top-Notch City Estates app on Android and iOS. It includes features like property search, voice search, map views, and instant alerts.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us via:\nPhone: +234-XXX-XXXXXXX\nEmail: support@topnotchcity.com\nLive chat: Available on our website and app during business hours.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Absolutely. We use modern encryption and data protection protocols to keep your information secure. We never share your data without consent.",
  },
  {
    question: "Can I list international properties?",
    answer:
      "Yes, we allow listings outside Nigeria, provided they meet our verification criteria. Contact our team for cross-border listing support.",
  },
];

export default function FAQ() {
  return (
    <BodyScrollView withBackground>
      <View className="flex-1 gap-4 p-4 pt-8">
        <Text className="text-xl">🏡 Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <View key={index} className="gap-1">
            <Text className="font-medium text-lg">
              {index + 1}. {faq.question}
            </Text>
            <Text className="font-light text-sm">{faq.answer}</Text>
          </View>
        ))}
      </View>
    </BodyScrollView>
  );
}
