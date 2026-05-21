// app/(tabs)/terms.js
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: 'checkmark-circle-outline',
      content: [
        'By accessing or using the UENR Marketplace application, you agree to be bound by these Terms and Conditions.',
        'If you do not agree to these terms, please do not use our platform.',
        'We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.',
      ],
    },
    {
      id: 'eligibility',
      title: 'Eligibility',
      icon: 'people-outline',
      content: [
        'You must be a registered student, faculty member, or staff of UENR to use this platform.',
        'By using our services, you confirm that you are at least 18 years old or have parental consent.',
        'You agree to provide accurate, current, and complete information during registration.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
      ],
    },
    {
      id: 'listings',
      title: 'Product Listings',
      icon: 'cart-outline',
      content: [
        'Sellers must provide accurate descriptions, images, and pricing for all listed items.',
        'Prohibited items include: illegal goods, weapons, drugs, counterfeit products, and stolen property.',
        'We reserve the right to remove any listing that violates our policies.',
        'Sellers are responsible for ensuring their items meet quality and safety standards.',
        'All academic textbooks must be authentic and not violate copyright laws.',
      ],
    },
    {
      id: 'transactions',
      title: 'Transactions & Payments',
      icon: 'card-outline',
      content: [
        'All transactions are between buyers and sellers. UENR Marketplace facilitates but does not guarantee transactions.',
        'Payment methods include mobile money, card payments, and cash on pickup.',
        'Sellers must fulfill orders within 48 hours of payment confirmation.',
        'Buyers should inspect items before completing cash transactions.',
        'Keep all transaction receipts and communication for dispute resolution.',
      ],
    },
    {
      id: 'printing',
      title: 'Printing Services',
      icon: 'print-outline',
      content: [
        'Printing services are provided by verified campus printing presses.',
        'Uploaded documents are stored securely and deleted after 7 days.',
        'Copyrighted materials require proof of ownership or permission to print.',
        'We are not responsible for printing errors caused by user-submitted files.',
        'Refunds for printing services are subject to the printing press\'s policy.',
        'Ticket numbers must be presented for order pickup.',
      ],
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: 'refresh-outline',
      content: [
        'Returns are subject to individual seller policies.',
        'Items must be returned within 7 days of delivery in original condition.',
        'Buyers should contact sellers directly for return authorization.',
        'Digital products, perishables, and personalized items cannot be returned.',
        'UENR Marketplace may mediate disputes but does not process refunds directly.',
        'Fraudulent return claims will result in account suspension.',
      ],
    },
    {
      id: 'user-conduct',
      title: 'User Conduct',
      icon: 'warning-outline',
      content: [
        'Treat all users with respect. Harassment, spam, or abusive behavior is prohibited.',
        'Do not post false, misleading, or deceptive information.',
        'Respect intellectual property rights. Do not upload copyrighted content without permission.',
        'Do not attempt to hack, disrupt, or compromise platform security.',
        'Report suspicious activities to our support team immediately.',
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: 'lock-closed-outline',
      content: [
        'We collect and process personal data as described in our Privacy Policy.',
        'Your information is used to facilitate transactions and improve our services.',
        'We do not sell your personal data to third parties.',
        'You can request data deletion by contacting our support team.',
        'Messages and communications are stored for transaction verification.',
      ],
    },
    {
      id: 'fees',
      title: 'Fees & Commissions',
      icon: 'cash-outline',
      content: [
        'Listing products on UENR Marketplace is currently free.',
        'A small transaction fee (5%) applies to completed sales.',
        'Printing service fees are set by individual printing presses.',
        'Payment gateway charges may apply based on your chosen method.',
        'We will notify users before introducing any new fees.',
      ],
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers',
      icon: 'alert-circle-outline',
      content: [
        'UENR Marketplace is provided "as is" without warranties of any kind.',
        'We do not guarantee continuous, error-free, or secure access to our platform.',
        'We are not responsible for user-generated content or third-party links.',
        'Campus meetups for transactions are at your own risk. Use public, safe locations.',
        'We reserve the right to suspend accounts violating these terms.',
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: 'shield-outline',
      content: [
        'UENR Marketplace is not liable for indirect, incidental, or consequential damages.',
        'Our maximum liability is limited to the transaction amount paid through our platform.',
        'We are not responsible for disputes between buyers and sellers beyond reasonable mediation.',
        'Users agree to indemnify UENR Marketplace against claims arising from their actions.',
      ],
    },
    {
      id: 'termination',
      title: 'Account Termination',
      icon: 'person-remove-outline',
      content: [
        'We may suspend or terminate accounts that violate these terms.',
        'Users can delete their accounts by contacting support.',
        'Termination does not affect completed transactions or pending disputes.',
        'Fraudulent activities will be reported to university authorities.',
      ],
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@uenrmarketplace.com');
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Report an Issue',
      'How would you like to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email Support', onPress: handleContactSupport },
        { text: 'Call Security', onPress: () => Linking.openURL('tel:0241234567') },
      ],
      { cancelable: true }
    );
  };

  const handleAcceptTerms = () => {
    Alert.alert(
      'Accept Terms & Conditions',
      'By accepting, you agree to comply with all the terms outlined in this document.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => {
            Alert.alert('Success', 'Terms accepted. You can now use the platform.');
            router.back();
          }
        },
      ]
    );
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#00BFFF" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.whiteBackground}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#1A365D" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Terms & Conditions</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Last Updated */}
            <View style={styles.lastUpdatedContainer}>
              <Ionicons name="calendar-outline" size={16} color="#718096" />
              <Text style={styles.lastUpdatedText}>Last Updated: January 15, 2024</Text>
            </View>

            {/* Introduction */}
            <View style={styles.introContainer}>
              <Text style={styles.introText}>
                Welcome to UENR Marketplace. By using our platform, you agree to these terms. 
                Please read them carefully before using our services.
              </Text>
            </View>

            {/* Terms Sections */}
            {sections.map((section) => (
              <View key={section.id} style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name={section.icon} size={24} color="#00BFFF" />
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  <Ionicons
                    name={expandedSection === section.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#718096"
                  />
                </TouchableOpacity>
                
                {expandedSection === section.id && (
                  <View style={styles.sectionContent}>
                    {section.content.map((paragraph, index) => (
                      <View key={index} style={styles.paragraphContainer}>
                        <View style={styles.bulletPoint}>
                          <Text style={styles.bulletSymbol}>•</Text>
                          <Text style={styles.paragraphText}>{paragraph}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {/* Important Notes */}
            <View style={styles.importantContainer}>
              <View style={styles.importantHeader}>
                <Ionicons name="warning" size={24} color="#FFA500" />
                <Text style={styles.importantTitle}>Important Notes</Text>
              </View>
              <View style={styles.importantContent}>
                <Text style={styles.importantText}>
                  1. Always meet in public, well-lit areas on campus for transactions.
                </Text>
                <Text style={styles.importantText}>
                  2. Report suspicious users or fraudulent activities immediately.
                </Text>
                <Text style={styles.importantText}>
                  3. Keep records of all communications and receipts.
                </Text>
                <Text style={styles.importantText}>
                  4. Academic integrity policies apply to textbook sales.
                </Text>
                <Text style={styles.importantText}>
                  5. For disputes, contact support within 14 days of transaction.
                </Text>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.contactContainer}>
              <Text style={styles.contactTitle}>Contact Us</Text>
              <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
                <Ionicons name="mail-outline" size={20} color="#00BFFF" />
                <Text style={styles.contactButtonText}>support@uenrmarketplace.com</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('tel:0241234567')}>
                <Ionicons name="call-outline" size={20} color="#00BFFF" />
                <Text style={styles.contactButtonText}>024 123 4567</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('https://uenr.edu.gh')}>
                <Ionicons name="globe-outline" size={20} color="#00BFFF" />
                <Text style={styles.contactButtonText}>www.uenr.edu.gh</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.reportButton} onPress={handleReportIssue}>
                <Ionicons name="flag-outline" size={20} color="#FF3B30" />
                <Text style={styles.reportButtonText}>Report an Issue</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptTerms}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.acceptButtonText}>Accept Terms</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 UENR Marketplace. All rights reserved.
              </Text>
              <Text style={styles.footerSubtext}>
                UENR Marketplace is an official student marketplace platform
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  whiteBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A365D',
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#718096',
  },
  introContainer: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00BFFF',
  },
  introText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  sectionContainer: {
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A365D',
  },
  sectionContent: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paragraphContainer: {
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletSymbol: {
    fontSize: 14,
    color: '#00BFFF',
    marginTop: 2,
  },
  paragraphText: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  importantContainer: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  importantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFA500',
  },
  importantContent: {
    gap: 8,
  },
  importantText: {
    fontSize: 13,
    color: '#8B6914',
    lineHeight: 18,
  },
  contactContainer: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A365D',
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  contactButtonText: {
    fontSize: 14,
    color: '#00BFFF',
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  reportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00BFFF',
    paddingVertical: 12,
    borderRadius: 12,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#A0AEC0',
    textAlign: 'center',
  },
});